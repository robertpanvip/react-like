import {
    h,
    isVNode,
    defineAsyncComponent,
    Suspense as VueSuspense,
    Fragment as VueFragment,
    defineComponent as defineVueComponent,
    useAttrs,
    getCurrentInstance as getVueCurrentInstance,
    ComponentInternalInstance,
    VNode,
    nextTick,
    Ref as VueRef,
    Slots,
} from 'vue'
import type { DefineSetupFnComponent } from 'vue' // 顶部新增这行导入
import {
    createClassComponent,
    depsEqual,
    normalizeChildren,
    normalizeStyle,
    shallowEqual,
    useExposeRef
} from "./util";

/* ------------------------------------------------------------------ */

/* hooks runtime（核心）                                               */
function getCurrentInstance(): (ComponentInternalInstance & { __hookIndex__?: number, idx?: number }) | null {
    return getVueCurrentInstance()
}

const hookStateMap = new WeakMap<any, any[]>()

function getHookState() {
    const inst = getCurrentInstance()
    if (!inst) {
        throw new Error('Hooks can only be called inside component render')
    }

    let hooks = hookStateMap.get(inst)
    if (!hooks) {
        hooks = []
        hookStateMap.set(inst, hooks)
    }

    const index = inst.__hookIndex__ ?? 0
    inst.__hookIndex__ = index + 1

    return {hooks, index, inst}
}

const FORWARD = Symbol('forward-ref')
const PROVIDER = Symbol('provider')
namespace React {
    export const Suspense = VueSuspense
    export const Fragment = VueFragment

    export type SetStateAction<S> = S | ((prevState: S) => S);
    export type Dispatch<A> = (value: A) => void;
    export type Reducer<S, A> = (prevState: S, action: A) => S;

    export type JSXElementConstructor<P = any> = (props: P) => any
    export type ReactElement = VNode;
    export type ReactNode = VNode | string | number | boolean | null | undefined | void

    export interface RefObject<T> extends VueRef {
        readonly current: T | null
    }

    export interface MutableRefObject<T> extends VueRef {
        current: T;
    }

    export type RefCallback<T> = ((instance: T | null) => void)
    export type Ref<T> = RefCallback<T> | RefObject<T> | null;
    export type LegacyRef<T> = string | Ref<T>;
    export type ForwardedRef<T> = ((instance: T | null) => void) | MutableRefObject<T | null> | null;
    export type Key = string | number | bigint;
    export type FC<P = {}> = FunctionComponent<P>;

    export interface ExoticComponent<P = {}> {
        (props: P): ReactNode;

        readonly $$typeof: symbol;
    }

    export interface NamedExoticComponent<P = {}> extends ExoticComponent<P> {
        displayName?: string | undefined;
    }

    export type PropsWithoutRef<P> =
        P extends any ? ("ref" extends keyof P ? Omit<P, "ref"> : P) : P;

    export interface ForwardRefExoticComponent<P> extends NamedExoticComponent<P> {
        defaultProps?: Partial<P> | undefined;
        propTypes?: never;
    }

    export interface FunctionComponent<P = {}> {
        (props: P, context?: any): ReactNode;

        displayName?: string;
        defaultProps?: Partial<P>;
    }

    export interface Attributes {
        key?: Key | null | undefined;
    }

    export interface RefAttributes<T> extends Attributes {
        ref?: LegacyRef<T> | undefined;
    }

    export function useState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
        const {hooks, index, inst} = getHookState()

        if (!hooks[index]) {
            const initialValue = typeof initialState === 'function'
                ? (initialState as () => T)()
                : initialState;
            hooks[index] = {
                stateRef: initialValue, // ✅ 核心：用ref存储状态，响应式自动触发重渲染
                updaters: [] as Array<(prev: T) => T>, // ✅ 更新队列：收集所有setState
                isFlushing: false // ✅ 防抖锁：防止同一批次重复执行队列
            }
        }

        const hookNode = hooks[index] as {
            stateRef: T,
            updaters: Array<(prev: T) => T>,
            isFlushing: boolean
        }
        const setState = (payload: T | ((prev: T) => T)) => {
            // 统一封装更新器：兼容 直接传值(setCount(10)) 和 函数式更新(setCount(p=>p+1))
            const updater = (prev: T): T => {
                return typeof payload === 'function'
                    ? (payload as (prev: T) => T)(prev)
                    : payload
            }
            // 只入队，不立即修改ref → 同步阶段ref值不变，快照特性达成
            hookNode.updaters.push(updater);
            if (hookNode.isFlushing) return
            hookNode.isFlushing = true
            // 加入Vue的更新队列，批量执行，完美异步
            queueMicrotask(() => {
                try {
                    const prevValue = hookNode.stateRef!
                    let nextValue: any = prevValue
                    // 批量执行所有更新器，计算最终最新值
                    hookNode.updaters.forEach(fn => {
                        nextValue = fn(nextValue)
                    })
                    hookNode.updaters = [] // 清空队列，准备下一批更新

                    // ✅ 性能优化：值不变则不修改ref，不触发任何重渲染
                    if (!Object.is(prevValue, nextValue)) {
                        hookNode.stateRef = nextValue // ✅ 唯一一次修改ref → 触发一次重渲染
                        inst.update();
                    }
                } finally {
                    hookNode.isFlushing = false // 解锁，允许下一批更新
                }
            })
        }

        return [hookNode.stateRef!, setState] as const
    }

    export function useRef<T>(initialValue: T): MutableRefObject<T>;
    export function useRef<T>(initialValue: T | null): RefObject<T>;
    export function useRef<T = undefined>(initialValue?: undefined): MutableRefObject<T | undefined>;
    export function useRef<T>(initialValue: T): { current: T } {
        const {hooks, index} = getHookState()

        if (!hooks[index]) {
            const ref = {
                current: initialValue,
                __v_isRef: true,
                get value() {
                    return ref.current
                },
                set value(value) {
                    ref.current = value
                }
            };
            hooks[index] = ref
        }

        return hooks[index]
    }

    export function useMemo<T>(fn: () => T, deps: any[]) {
        const {hooks, index} = getHookState()
        const prev = hooks[index]

        if (!prev || !depsEqual(prev.deps, deps)) {
            hooks[index] = {
                value: fn(),
                deps
            }
        }

        return hooks[index].value
    }

    export function useCallback<T extends Function>(fn: T, deps: any[]) {
        return useMemo(() => fn, deps)
    }

    export function useEffect(fn: () => void | (() => void), deps?: any[]) {
        const {hooks, index} = getHookState()
        const prev = hooks[index]

        if (!prev || !depsEqual(prev.deps, deps)) {
            prev?.cleanup?.();
            queueMicrotask(() => {
                const cleanup = fn(); // 执行本次effect回调，拿到清理函数
                // ✅ 修复BUG2：在微任务内赋值，不提前覆盖prev，存入最新的deps和cleanup
                hooks[index] = {
                    deps: deps,
                    cleanup: typeof cleanup === 'function' ? cleanup : null
                };
            })
        }
    }

    export const useLayoutEffect = useEffect;

    export const useInsertionEffect = useEffect;

    export function useTransition() {
        // 用useState标记过渡状态（是否在等待低优先级更新）
        const [isPending, setIsPending] = useState(false);

        // startTransition：包裹低优先级更新逻辑
        const startTransition = (callback: () => void) => {
            setIsPending(true); // 标记开始过渡
            // 用setTimeout延迟执行（模拟低优先级调度）
            setTimeout(() => {
                callback(); // 执行低优先级更新
                setIsPending(false); // 标记过渡结束
            }, 0); // 延迟0ms，让浏览器先处理高优先级任务（如输入）
        };

        return [startTransition, isPending] as const;
    }

    export function createElement(type: any, props: any = {}, ...children: any) {
        if (!props) {
            props = {}
        }
        if (props.className) {
            props.class = props.className
            delete props.className
        }
        if (children.length === 0 && props.children) {
            children = props.children
        }
        if (props.children) {
            delete props.children
        }

        props.style && (props.style = normalizeStyle(props.style))

        const normalized =
            Array.isArray(children)
                ? children
                : [children]

        if (typeof type === 'string') {
            // 原生元素：永远普通 children
            return h(type, props, normalized)
        }

        // 组件：永远 slot
        return h(type, props, {
            default: () => normalized
        })
    }

    export function cloneElement(node: any, props: any = {}, ...children: any) {
        if (props?.className) {
            props.class = props.className
            delete props.className
        }
        if (children.length === 0) {
            children = props?.children || node.children
            delete props.children
        }
        if (props?.children) {
            delete props.children
        }
        return createElement(node.type, {...node.props, ...props}, ...children);
    }

    export function isValidElement(val: any) {
        return isVNode(val)
    }

    /* Context                                                             */
    export function createContext<T>(defaultValue?: T) {
        const key = Symbol('context')
        const ConsumerRender = (props: any) => {
            const value = useContext({_key: key})
            return props.children(value)
        }
        (ConsumerRender as any).$typeof = PROVIDER

        const Consumer = defineComponent(ConsumerRender)

        const Provider = defineComponent<{ value: T }, any>((props: { value: T; children: any }) => {
            const inst = getCurrentInstance()!
            inst.appContext.provides[key] = props.value || defaultValue
            return props.children
        })

        return {
            _key: key,
            _default: defaultValue,
            Consumer,
            Provider
        }
    }

    export function useReducer<S, A>(
        reducer: Reducer<S, A>,
        initialState: S | (() => S), // 允许初始状态是函数
        initializer?: (state: S) => S // 可选的初始化器（React 完整特性）
    ): [S, Dispatch<A>] {
        // 处理初始状态（支持函数形式）
        const resolvedInitialState = typeof initialState === 'function'
            ? (initialState as () => S)()
            : initialState;

        // 应用 initializer 处理（如状态重置逻辑）
        const finalInitialState = initializer
            ? initializer(resolvedInitialState)
            : resolvedInitialState;

        // 复用 useState 存储状态
        const [state, setState] = useState(finalInitialState);

        const dispatch: Dispatch<A> = (action) => {
            const nextState = reducer(state, action);
            setState(nextState);
        };

        return [state, dispatch] as const;
    }

    export function useContext<T>(context: any): T {
        const inst = getCurrentInstance()
        return inst?.appContext.provides[context?._key] ?? context?._default
    }

    export function useImperativeHandle<T>(ref: { current: T | null }, factory: () => T, deps: any[] = []) {
        useEffect(() => {
            if (ref) ref.current = factory()
            return () => {
                if (ref) ref.current = null
            }
        }, deps)
    }

    export function startTransition(fn: () => void) {
        // Vue 的更新已经是批量异步的，这里用 nextTick 模拟
        nextTick(fn).catch()
    }

    export function useId() {
        const inst = getCurrentInstance()!
        inst.idx = (inst.idx ? inst.idx : 0) + 1
        return `uid-${inst.idx}`
    }

    export function isFragment(node: any): boolean {
        return isVNode(node) && node.type === VueFragment
    }


    export function forwardRef<T, P = {}>(render: (props: P, ref: { current: T | null }) => any) {
        (render as any).$typeof = FORWARD
        return render
    }

    export const memo = <T>(component: T) => component // Vue 自带响应式，无需额外 memo


    export function lazy<T>(loader: () => Promise<{ default: T }>) {
        return defineAsyncComponent(loader)
    }

    export function createRef() {
        return useRef();
    }

    export class Component<P, S> {
        defaultProps?: P;
        displayName?: string | undefined;
        readonly props: Readonly<P>;
        state: Readonly<S>;
        context: unknown;
        static contextType?: any | undefined;

        constructor(props: P) {
            this.props = props;
            this.state = {} as S;
        }

        setState<K extends keyof S>(
            _state: ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | null) | (Pick<S, K> | S | null),
            _callback?: () => void,
        ): void {

        };

        componentDidMount?(): void;

        shouldComponentUpdate?(nextProps: P, nextState: S,nextContext: any): boolean;

        componentDidUpdate?(prevProps: P, prevState: S): void;

        componentWillUnmount?(): void;

        forceUpdate(_callback?: () => void) {
            const inst = getCurrentInstance();
            inst?.update();
            _callback?.()
        }

        render?(): ReactNode
    }

    export class PureComponent<P = {}, S = {}> extends Component<P, S> {
        shouldComponentUpdate(nextProps: P, nextState: S) {
            return !shallowEqual(this.props, nextProps as Readonly<P>) || !shallowEqual(this.state, nextState as Readonly<S>);
        }
    }

    export const Children = {
        map(children: any[], fn: (child: any, index: number) => any) {
            if (!children) return []
            return normalizeChildren([children]).map(fn)
        },
        forEach(children: any[], fn: (child: any, index: number) => void) {
            normalizeChildren([children]).forEach(fn)
        },
        count(children: any[]) {
            return normalizeChildren(children).length
        },
        only(children: any[]) {
            const normalized = normalizeChildren(children)
            if (normalized.length !== 1) throw new Error('Children.only expects exactly one child')
            return normalized[0]
        },
        toArray(children: any[]) {
            return normalizeChildren(children)
        },
    }

    export const version = "18.2.0";
}

export const useState = React.useState;
export const useEffect = React.useEffect;
export const useMemo = React.useMemo;
export const useRef = React.useRef;
export const useCallback = React.useCallback;
export const createContext = React.createContext;
export const useContext = React.useContext;
export const useImperativeHandle = React.useImperativeHandle;
export const useInsertionEffect = React.useInsertionEffect;
export const useReducer = React.useReducer;
export const useTransition = React.useTransition;
export const useLayoutEffect = React.useLayoutEffect;
export const useId = React.useId;

export const createElement = React.createElement;
export const memo = React.memo;
export const Children = React.Children;
export const cloneElement = React.cloneElement;
export const createRef = React.createRef;
export const forwardRef = React.forwardRef;
export const Fragment = React.Fragment;
export const isValidElement = React.isValidElement;
export const version = React.version;
export const Component = React.Component;
export const PureComponent = React.PureComponent;

export type ReactNode = React.ReactNode;
export type ReactElement = React.ReactElement;
export type SetStateAction<T> = React.SetStateAction<T>;
export type Dispatch<T> = React.Dispatch<T>;
export type Reducer<T, A> = React.Reducer<T, A>;
export type FC<P = {}> = React.FC<P>;
export type Ref<P = {}> = React.Ref<P>;
export type RefObject<T = null> = React.RefObject<T>;
export type MutableRefObject<T> = React.MutableRefObject<T>;
export type ForwardRefExoticComponent<P> = React.ForwardRefExoticComponent<P>;
export type PropsWithoutRef<P> = React.PropsWithoutRef<P>;
export type RefAttributes<T> = React.RefAttributes<T>;

/* defineComponent（关键：重置 hookIndex）                             */
export function defineComponent<P extends object, T extends Function>(fn: T):DefineSetupFnComponent<P, {}, {}>  {
    return defineVueComponent<P>({
        inheritAttrs: false,
        setup(_, {slots, expose}) {
            const attrs = useAttrs();
            const ref = useExposeRef(expose);
            let render = (fn as any);
            if (fn.prototype instanceof React.Component) {
                render = createClassComponent(fn as any)
            }
            return () => {
                const inst = getCurrentInstance()!
                inst.__hookIndex__ = 0;
                inst.idx = 0;

                const len = (inst.vnode.children as Slots)?.default?.length || 0;
                const props = {
                    ...attrs,
                    children: len !== 0 ? slots.default : slots.default?.()
                }
                return render.$typeof === FORWARD ? render(props, ref) : render(props)
            }
        }
    }) as DefineSetupFnComponent<P, {}, {}>
}

export default React

