import {
    Component,
    forwardRef,
    MutableRefObject,
    Ref,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    ReactNode,
} from "./index";
import {getCurrentInstance, shallowReactive, watch} from "vue";

const PIXEL_PROPERTIES = [
    'width', 'height',
    'minWidth', 'minHeight', 'maxWidth', 'maxHeight',
    'fontSize', 'lineHeight', 'letterSpacing',
    'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'top', 'right', 'bottom', 'left',
    'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
    'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius',
    'outlineWidth',
    'flexBasis',
    'gap', 'columnGap', 'rowGap',
    // 动画/过渡
    'transitionDuration', 'animationDuration',
    // 文本
    'textIndent',
    // 阴影
    'boxShadow', 'textShadow', // 注意：这俩通常是字符串，不处理
] as const;

const PIXEL_SET = new Set<string>(PIXEL_PROPERTIES);

/**
 * 将 React 风格的 style 转换为 Vue 可用的 style
 * 数字 → 加 'px'，字符串 → 原样保留
 */
export function normalizeStyle(style: Record<string, any> | null | undefined): Record<string, any> {
    if (!style) return {};

    const result: Record<string, any> = {};

    for (const key in style) {
        const value = style[key];

        // 跳过 null / undefined
        if (value == null) continue;

        // 字符串直接保留（如 '50%', 'red', '1px solid black'）
        if (typeof value === 'string') {
            result[key] = value;
            continue;
        }

        // 数字：判断是否需要加 px
        if (typeof value === 'number') {
            if (PIXEL_SET.has(key)) {
                result[key] = `${value}px`;
            } else {
                // 非 px 属性（如 opacity, zIndex, flexGrow）直接转字符串
                result[key] = value;
            }
            continue;
        }

        // 其他类型（如对象、数组）转字符串
        result[key] = String(value);
    }

    return result;
}

export function setRef<T>(ref: Ref<T>, value: T | null) {
    if (!ref) return
    if (typeof ref === 'function') {
        ref(value)
    } else {
        (ref as MutableRefObject<T>).current = value as T
    }
}

/**
 * 默认浅比较实现
 * 对象类型只比较第一层属性，其他类型直接 ===
 */
export const shallowEqual = (prev: any, next: any) => {
    if (prev === next) return true;

    if (
        typeof prev !== 'object' || prev === null ||
        typeof next !== 'object' || next === null
    ) {
        return false;
    }

    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);

    if (prevKeys.length !== nextKeys.length) return false;

    for (let key of prevKeys) {
        if ((prev as any)[key] !== (next as any)[key]) return false;
    }

    return true;
};

export function depsEqual(a?: any[], b?: any[]) {
    if (!a || !b) return false
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
        if (!Object.is(a[i], b[i])) return false
    }
    return true
}

export function normalizeChildren(children: any[]): any[] {
    return children.flat().map(child => {
        if (child == null || child === false) return null
        if (typeof child === 'string' || typeof child === 'number') return child
        return child
    }).filter(Boolean)
}

type Expose = <Exposed extends Record<string, any> = Record<string, any>>(exposed?: Exposed | undefined) => void

export function useExposeRef(expose: Expose) {
    const exp: Record<string, unknown> = {};
    expose(exp);
    const ref = shallowReactive({current: null})
    watch(ref, (val) => {
        const next: Record<string, unknown> = val.current || {}
        // 删除 exp 中多余的 key
        for (const key in exp) {
            if (!(key in next)) {
                delete exp[key]
            }
        }
        // 3️⃣ 复制 / 更新 next 中的 key
        for (const key in next) {
            exp[key] = next[key]
        }
        Object.setPrototypeOf(exp, Object.getPrototypeOf(next))
    })
    return ref;
}

export function createClassComponent<P, S = {}>(ComponentClass: typeof Component<P, S>) {
    return forwardRef((props: P, ref) => {
        // 1. 创建组件实例（仅在首次渲染时）
        const {current: instance} = useRef(new ComponentClass(props));
        (instance as any)._instance = getCurrentInstance();
        const cache = useRef<ReactNode>(null);

        const [state, setState] = useState(instance.state);
        // 2. 【新增核心】处理 contextType 静态属性 - 完美适配 React 原生逻辑
        instance.context = useContext(ComponentClass.contextType);
        instance.shouldComponentUpdate = instance.shouldComponentUpdate || (() => true)
        // 2. 替换 instance.setState，完全按 class 逻辑实现
        instance.state = state;
        instance.setState = (newState) => {
            const nextState = typeof newState === 'function' ? (newState as Function)(instance.state, instance.props) : newState;
            setState({...instance.state, ...nextState});
        };
        // 2. 同步 props 到实例（每次渲染时更新）
        Object.assign(instance.props, props);
        // 3. 模拟生命周期：componentDidMount（仅执行一次）
        useEffect(() => {
            instance.componentDidMount?.();
            return () => {
                instance.componentWillUnmount?.();
            };
        }, []);

        // 4. 模拟 componentDidUpdate（依赖 props 和 state 变化）
        useEffect(() => {
            instance.componentDidUpdate?.(instance.props, instance.state);
        }, [props, instance.state]);

        useImperativeHandle(ref, () => instance)


        const shouldUpdate = useRef<boolean>(true);

        useEffect(() => {
            shouldUpdate.current = instance.shouldComponentUpdate!(props, state, instance.context);
        }, [props, state, instance.context]);

        cache.current = shouldUpdate.current ? instance.render?.() : cache.current
        // 5. 执行 render 并转换为 Vue VNode
        return cache.current;
    });
}


export function clone(Comp:Function,fn:Function) {
    Object.assign(Comp, fn);
    // 2. 拷贝【自身不可枚举属性】：比如 Object.defineProperty 定义的属性、displayName等
    Object.getOwnPropertyNames(fn).forEach(key => {
        const desc = Object.getOwnPropertyDescriptor(fn, key);
        if (desc) Object.defineProperty(Comp, key, desc);
    });
    // 3. 拷贝【原型链属性】：原型方法/属性
    if (fn.prototype && typeof fn.prototype === 'object') {
        Object.getOwnPropertyNames(fn.prototype).forEach(key => {
            if (key !== 'constructor') { // 排除构造函数，避免循环引用
                const desc = Object.getOwnPropertyDescriptor(fn.prototype, key);
                if (desc) Object.defineProperty(Comp.prototype, key, desc);
            }
        });
    }
}