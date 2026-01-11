import {h, VNode, Fragment as VueFragment} from 'vue';
import {normalizeStyle} from "./util";

export namespace JSX {
    export interface Element extends VNode {
    }
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
};

function isValidElementType(type: unknown) {
    if (typeof type === 'string' || typeof type === 'function') {
        return true;
    }
    return false;
}

function hasValidKey(config: Record<string, unknown>) {
    return config.key !== undefined;
}

function hasValidRef(config: Record<string, unknown>) {
    return config.ref !== undefined;
}

const ReactElement = function (type, key, ref, self, source, owner, config) {

    if (!config) {
        config = {}
    }
    const props: Record<string, unknown> = {}
    let children: unknown = undefined
    if (config) {
        for (const prop in config) {
            if (prop === 'key' || prop === 'ref') continue
            if (prop === 'children') {
                children = config.children
            } else if (prop === 'className') {
                props.class = config[prop]
            } else if (prop === 'style') {
                props.style = normalizeStyle(props.style!)
            } else {
                props[prop] = config[prop]
            }
        }
    }
    if (key != null) props.key = key
    if (ref != null) props.ref = ref
    const normalized = Array.isArray(children) ? children : [children];

    if (typeof type === "string") {
        return h(type, props, normalized);
    }
    return h(type, props, {
        default: () => normalized
    });
};

function jsxDEV(type, config: Record<string, unknown>, maybeKey?: string, source?: string, self?: string) {
    let propName: string | undefined;

    let props = {};
    let key = null;
    let ref = null;

    if (maybeKey !== undefined) {
        key = '' + maybeKey;
    }

    if (hasValidKey(config)) {
        key = '' + config.key;
    }

    if (hasValidRef(config)) {
        ref = config.ref;
    }

    for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            props[propName] = config[propName];
        }
    }


    if (type && type.defaultProps) {
        const defaultProps = type.defaultProps;
        for (propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
            }
        }
    }
    return ReactElement(type, key, ref, self, source, null, props);
}

function jsxWithValidation(type, props, key, isStaticChildren: boolean, source?: string, self?: string) {
    {
        const validType = isValidElementType(type);
        const element = jsxDEV(type, props, key, source, self);
        if (element == null) {
            return element;
        }
        if (validType) {
            const children = props.children;
            if (children !== undefined) {
                if (isStaticChildren) {
                    if (Array.isArray(children)) {
                        if (Object.freeze) {
                            Object.freeze(children);
                        }
                    }
                }
            }
        }
        return element;
    }
}

function jsxWithValidationStatic(type, props, key) {
    {
        return jsxWithValidation(type, props, key, true);
    }
}

function jsxWithValidationDynamic(type, props, key) {
    {
        return jsxWithValidation(type, props, key, false);
    }
}

export const jsx = jsxWithValidationDynamic

export const jsxs = jsxWithValidationStatic


export const Fragment = VueFragment;


export default {jsx, jsxs}
