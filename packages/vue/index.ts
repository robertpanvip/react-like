import {
    h,
    defineAsyncComponent,
    Suspense as VueSuspense,
    defineComponent as defineVueComponent,
    useAttrs,
    getCurrentInstance as getVueCurrentInstance,
    inject,
    ComponentInternalInstance,
    VNode,
    nextTick,
    Ref as VueRef,
    ref,
    Slots, onUnmounted,
} from 'vue'
import type {DefineSetupFnComponent, ObjectEmitsOptions} from 'vue'
import {
    clone,
    createClassComponent,
    depsEqual,
    shallowEqual,
    useExposeRef
} from "./util";

/* ===================== 导入 ReactElement 层 ===================== */
import {
    REACT_ELEMENT_TYPE,
    REACT_FORWARD_REF_TYPE,
    REACT_PROVIDER_TYPE,
    REACT_CONSUMER_TYPE,
    REACT_FRAGMENT_TYPE,
    DEFINE_COMPONENT,
    createElement as createReactElement,
    createContext as createReactContext,
    forwardRef as createReactForwardRef,
    memo as createReactMemo,
    Children as ReactChildren,
    cloneElement as cloneReactElement,
    isValidElement as isValidReactElement,
    Fragment as ReactFragment,
    StrictModeFn,
    toVNode,
    __setDefineComponentRef,
    type ReactElement as RE,
} from './react-element'

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

/* 更新调度器：批量合并 inst.update() 调用 */
let _pendingUpdate: (() => void) | null = null
let _updateScheduled = false
function scheduleUpdate(inst: ComponentInternalInstance) {
    _pendingUpdate = () => { inst.update() }
    if (!_updateScheduled) {
        _updateScheduled = true
        queueMicrotask(() => {
            const upd = _pendingUpdate
            _pendingUpdate = null
            _updateScheduled = false
            if (upd) upd()
        })
    }
}

/** 重置调度器内部状态（用于测试隔离） */
export function resetReactScheduler() {
    _pendingUpdate = null
    _updateScheduled = false
}

namespace React {
    export const Suspense = VueSuspense
    export const Fragment = ReactFragment
    export const StrictMode = StrictModeFn;
    export const version = "19.0.0";
    export type SetStateAction<S> = S | ((prevState: S) => S);
    export type Dispatch<A> = (value: A) => void;
    export type Reducer<S, A> = (prevState: S, action: A) => S;

    export type JSXElementConstructor<P = any> = (props: P) => any
    export type ReactElement = RE;
    export type ReactNode = RE | string | number | boolean | null | undefined | void
    export type ReactInstance = Component<any, any> | Element;

    export interface RefObject<T> {
        readonly current: T | null
    }

    export interface MutableRefObject<T> {
        current: T;
    }

    export type RefCallback<T> = ((instance: T | null) => void)
    export type Ref<T = any> = RefCallback<T> | RefObject<T> | null;
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

    export type ReactPortal = ReactElement


    export function useState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
        const {hooks, index, inst} = getHookState()

        if (!hooks[index]) {
            const initialValue = typeof initialState === 'function'
                ? (initialState as () => T)()
                : initialState;
            hooks[index] = {
                state: initialValue,
                updaters: [] as Array<(prev: T) => T>,
                isFlushing: false
            }
        }

        const hookNode = hooks[index] as {
            state: T,
            updaters: Array<(prev: T) => T>,
            isFlushing: boolean
        }
        const setState = (payload: T | ((prev: T) => T)) => {
            const updater = (prev: T): T => {
                return typeof payload === 'function'
                    ? (payload as (prev: T) => T)(prev)
                    : payload
            }
            hookNode.updaters.push(updater);
            if (hookNode.isFlushing) return
            hookNode.isFlushing = true
            try {
                const prevValue = hookNode.state
                let nextValue: any = prevValue
                hookNode.updaters.forEach(fn => {
                    nextValue = fn(nextValue)
                })
                hookNode.updaters = []
                if (!Object.is(prevValue, nextValue)) {
                    hookNode.state = nextValue
                    // 始终触发重新渲染，包括初始渲染期间
                    // React 中 setState 在渲染期间会被批处理，渲染结束后统一应用
                    // 我们的实现通过 queueMicrotask 延迟到渲染完成后执行，确保组件已挂载
                    scheduleUpdate(inst)
                }
            } finally {
                hookNode.isFlushing = false
            }
        }

        return [hookNode.state, setState] as const
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
            // 先执行前一个 effect 的清理函数（如果存在）
            // prev.cleanup 在微任务中设置，但如果组件重新渲染时微任务已执行，cleanup 已可用
            if (prev && prev.cleanup) {
                prev.cleanup();
            }
            // 同步存储新的 deps，确保下一次渲染时 deps 比较正确
            // cleanup 引用在微任务中更新，但 cleanup 函数本身是之前同步存储的
            const newHook = {
                deps: deps,
                cleanup: null as (() => void) | null
            };
            hooks[index] = newHook;
            // 使用微任务调度 effect 函数执行，确保在 DOM 提交后执行
            // 与 React 的 useEffect 语义一致：在渲染提交到屏幕后异步执行
            queueMicrotask(() => {
                const cleanup = fn();
                newHook.cleanup = typeof cleanup === 'function' ? cleanup : null;
            });
        }
    }

    export const useLayoutEffect = useEffect;
    export const useInsertionEffect = useEffect;

    export function useTransition() {
        const [isPending, setIsPending] = useState(false);
        const startTransition = (callback: () => void) => {
            setIsPending(true);
            setTimeout(() => {
                callback();
                setIsPending(false);
            }, 0);
        };
        return [startTransition, isPending] as const;
    }

    export function useReducer<S, A>(
        reducer: Reducer<S, A>,
        initialState: S | (() => S),
        initializer?: (state: S) => S
    ): [S, Dispatch<A>] {
        const resolvedInitialState = typeof initialState === 'function'
            ? (initialState as () => S)()
            : initialState;
        const finalInitialState = initializer
            ? initializer(resolvedInitialState)
            : resolvedInitialState;
        const [state, setState] = useState(finalInitialState);
        const dispatch: Dispatch<A> = (action) => {
            const nextState = reducer(state, action);
            setState(nextState);
        };
        return [state, dispatch] as const;
    }

    export function useContext<T>(context: any): T {
        const inst = getCurrentInstance()
        const val = inst?.provides[context?._key]
        if (val === undefined && context?._defaultValue !== undefined) {
            // fallback to inject approach for cases where Vue's provide/inject
            // chain might be broken by our custom component wrappers
            try {
                const injected = inject(context._key, context._defaultValue)
                return injected as T
            } catch {
                return context._defaultValue as T
            }
        }
        return (val !== undefined ? val : context?._defaultValue) as T
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
        nextTick(fn).catch()
    }

    export function useId() {
        const inst = getCurrentInstance()!
        inst.idx = (inst.idx ? inst.idx : 0) + 1
        return `uid-${inst.idx}`
    }

    export function useDebugValue<T>(value: T, formatter?: (value: T) => any) {
        // No-op in non-dev environment. In React, this adds a label to custom hooks
        // in React DevTools. Since we're in a Vue environment, there's no React DevTools
        // to display this information. The function is provided for API compatibility.
    }

    export function isFragment(node: any): boolean {
        return typeof node === 'object' && node !== null && node.$$typeof === REACT_ELEMENT_TYPE && node.type === REACT_FRAGMENT_TYPE
    }

    /* ===================== 基于 ReactElement 的 API ===================== */
    export const createElement = createReactElement
    export const createContext = createReactContext
    export const forwardRef = createReactForwardRef
    export const memo = createReactMemo
    export const Children = ReactChildren
    export const cloneElement = cloneReactElement
    export const isValidElement = isValidReactElement
    export const lazy = <T>(loader: () => Promise<{ default: T }>) => defineAsyncComponent(loader)
    export const createRef = () => ({ current: null })

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
        ): void {};

        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: P, nextState: S, nextContext: any): boolean;
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
}

/* ===================== 导出 API ===================== */
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
export const useDebugValue = React.useDebugValue;

export const createElement = React.createElement;
export const memo = React.memo;
export const Children = React.Children;
export const cloneElement = React.cloneElement;
export const createRef = React.createRef;
export const forwardRef = React.forwardRef;
export const Fragment = React.Fragment;
export const StrictMode = React.StrictMode;
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
export type ReactPortal = React.ReactPortal;
export type ReactInstance = React.ReactInstance;

export type DefineComponent<Props extends Record<string, any>, E extends ObjectEmitsOptions = {}> =
    DefineSetupFnComponent<Props, E, any>
    & {
    $typeof: symbol
};

type PickOnKeys<T> = {
    [K in keyof T]: K extends `on${string}` ? K : never
}[keyof T]

type RemoveOnPrefix<K extends string> = K extends `on${infer First}${infer Rest}`
    ? `${Lowercase<First>}${Rest}`
    : K;
type ExtractEmits<T> = {
    [K in PickOnKeys<T> as RemoveOnPrefix<K>]: T[K] extends ((...args: any[]) => any) ? T[K] : () => void
};

/* slot↔prop 映射契约（暂未启用，预留接口） */
export interface SlotMap {
    prop?: string;
    toSlot?: (...reactArgs: any[]) => any
}
export type SlotMaps = Record<string, SlotMap>

/* ===================== defineComponent（核心桥接） ===================== */
export function defineComponent<P extends Record<string, any>, T extends (props: P, ref?: unknown) => any>(
    fn: T,
    slotMaps?: SlotMaps
): DefineComponent<P, ExtractEmits<P>> {
    // 处理 forwardRef 对象
    let render: any = fn;
    let isForwardRef = false;
    if (fn && typeof fn === 'object' && (fn as any).$$typeof === REACT_FORWARD_REF_TYPE) {
        render = (fn as any).render;
        isForwardRef = true;
    }

    const Comp = defineVueComponent<P>({
        inheritAttrs: false,
        setup(_, {slots, expose, emit}) {
            const attrs = useAttrs();
            const ref = useExposeRef(expose);
            let finalRender = render;
            if (render.prototype instanceof React.Component) {
                finalRender = createClassComponent(render)
            }
            onUnmounted(() => {
                const inst = getCurrentInstance()!
                const hooks = hookStateMap.get(inst)
                if (hooks) {
                    hooks.forEach(hook => {
                        if (hook && typeof hook.cleanup === 'function') {
                            try { hook.cleanup() } catch (e) {}
                        }
                    })
                }
                hookStateMap.delete(inst)
            })
            return () => {
                const inst = getCurrentInstance()!
                inst.__hookIndex__ = 0;
                inst.idx = 0;

                // children 归一化：优先从 __reactChildren（原始 React 子节点）取，
                // 其次是 slots.default（Vue 插槽，用于 antd 的 render props 等场景）。
                // 使用 __reactChildren 避免 slots.default() 返回 Vue VNode 导致 antd 无法渲染。
                const children = attrs.__reactChildren ?? (slots.default ? slots.default() : undefined);
                // 剥离 __reactChildren 防止其泄露到下游组件，避免被当作 DOM 属性渲染
                const { __reactChildren: _rc, ...cleanAttrs } = attrs as any;
                const _props = {
                    ...cleanAttrs,
                    children
                }
                const entries = Object.entries(_props).map(([key, value]) => {
                    if (key.startsWith('on') && typeof value === 'function') {
                        return [key, function (this: typeof _props, ...rest: unknown[]) {
                            // Note: we do NOT call emit() here because Vue 3 treats onXxx props
                            // as event listeners, causing emit('click',...) to trigger the same
                            // handler via Vue's event system, resulting in double invocation.
                            return value.apply(this, rest)
                        }];
                    } else if (key === 'children' && Array.isArray(value) && value.length == 1) {
                        return [key, value[0]];
                    }
                    return [key, value];
                })
                const props = Object.fromEntries(entries) as typeof _props;

                // 调用 React 组件函数 → 返回 ReactElement
                const result = isForwardRef ? finalRender(props, ref) : finalRender(props);

                // 翻译 ReactElement → Vue vnode
                return toVNode(result, {forwardRef: ref});
            }
        }
    })
    Comp.$typeof = DEFINE_COMPONENT;
    clone(Comp, fn);
    return Comp as unknown as DefineComponent<P, ExtractEmits<P>>
}

// 注册 defineComponent 引用到 react-element.ts 和 jsx-runtime.ts 解决循环依赖
__setDefineComponentRef(defineComponent)
import {__setJsxDefineComponentRef} from './jsx-runtime'
__setJsxDefineComponentRef(defineComponent)

export * from './client'

export * from './react-dom'

export default React