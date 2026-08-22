/**
 * jsx-runtime —— 被 Vite/Vue-JSX 插件调用的 JSX 转换入口。
 *
 * 与 createElement 保持一致的形状：返回 ReactElement（带 $$typeof），
 * 由下游 toVNode 翻译为 Vue vnode。
 */
import {Fragment as VueFragment} from 'vue';
import {normalizeStyle} from "./util";
import {
    REACT_ELEMENT_TYPE,
    REACT_FRAGMENT_TYPE,
    DEFINE_COMPONENT,
    type ReactElement,
} from './react-element';

export namespace JSX {
    export interface Element extends ReactElement {
    }
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
};

/* 延迟引用 defineComponent 避免循环依赖 */
let _defineComponent: ((fn: any) => any) | null = null;
function getDefineComponent() {
    if (!_defineComponent) {
        // 动态 import 不可用，通过全局引用方式
        // 将在模块初始化时由 index.ts 设置
        return (fn: any) => fn;
    }
    return _defineComponent;
}
export function __setJsxDefineComponentRef(ref: any) {
    _defineComponent = ref;
}

const typeCache = new WeakMap<Function, any>();

function ReactElement(type: any, key: any, ref: any, _self: any, _source: any, _owner: any, config: any): ReactElement {
    if (!config) config = {};

    const props: Record<string, any> = {};
    let children: any = undefined;

    for (const prop in config) {
        if (prop === 'key' || prop === 'ref') continue;
        if (prop === 'children') {
            children = config[prop];
        } else if (prop === 'style') {
            props.style = normalizeStyle(config[prop] as any);
        } else {
            // className 保持原样，不转 class —— toVNode 的 buildVNodeProps 会处理
            props[prop] = config[prop];
        }
    }

    if (key != null) props.key = key;
    if (ref != null) props.ref = ref;

    // 归一化 children
    let normalized = children == null ? [] : (Array.isArray(children) ? children : [children]);
    if (normalized.length === 1) normalized = normalized[0];

    // 未包装的纯函数组件 → 用 defineComponent 包装
    if (typeof type === 'function' && !type.$typeof) {
        let cached = typeCache.get(type);
        if (!cached) {
            cached = getDefineComponent()(type);
            typeCache.set(type, cached);
        }
        type = cached;
    }

    return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key: key ?? null,
        ref: ref ?? null,
        props: {...props, children: normalized},
        _owner: null,
    };
}

/* ===================== 导出给 Vite 的 JSX 转换入口 ===================== */

function jsxDEV(type: any, config: Record<string, any>, maybeKey?: string, _source?: string, _self?: string): ReactElement {
    let key: any = null;
    let ref: any = null;

    if (maybeKey !== undefined) key = '' + maybeKey;
    if (hasValidKey(config)) key = '' + config.key;
    if (hasValidRef(config)) ref = config.ref;

    const props: Record<string, any> = {};
    for (const propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            if (propName === 'style') {
                props[propName] = normalizeStyle(config[propName] as any);
            } else {
                props[propName] = config[propName];
            }
        }
    }

    if (type && type.defaultProps) {
        const defaultProps = type.defaultProps;
        for (const propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
            }
        }
    }

    return ReactElement(type, key, ref, _self, _source, null, props);
}

function hasValidKey(config: Record<string, any>) {
    return config.key !== undefined;
}

function hasValidRef(config: Record<string, any>) {
    return config.ref !== undefined;
}

function isValidElementType(type: any) {
    if (typeof type === 'string' || typeof type === 'function') return true;
    return false;
}

function jsxWithValidation(type: any, props: any, key: any, isStaticChildren: boolean, source?: string, self?: string): ReactElement {
    const validType = isValidElementType(type);
    const element = jsxDEV(type, props, key, source, self);
    if (element == null) return element;
    if (validType) {
        const children = props.children;
        if (children !== undefined) {
            if (isStaticChildren && Array.isArray(children)) {
                if (Object.freeze) Object.freeze(children);
            }
        }
    }
    return element;
}

function jsxWithValidationStatic(type: any, props: any, key: any) {
    return jsxWithValidation(type, props, key, true);
}

function jsxWithValidationDynamic(type: any, props: any, key: any) {
    return jsxWithValidation(type, props, key, false);
}

export const jsx = jsxWithValidationDynamic;
export const jsxs = jsxWithValidationStatic;
export const Fragment = VueFragment;

export default {jsx, jsxs}