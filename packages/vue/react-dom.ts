import type {
    ReactInstance,
    ReactNode,
    ReactPortal
} from './index';
import {createRoot, type Root} from './client'
import {toVNode, REACT_PORTAL_TYPE, REACT_ELEMENT_TYPE, type ReactElement} from './react-element'
import {createVNode, Teleport, getCurrentInstance} from 'vue'

export const version = "19.0.0";

export function findDOMNode(target: ReactInstance | null | undefined): Element | null | Text {
    let instance = (target as any)?._instance;
    if (instance && instance.vnode && instance.vnode.el) {
        return instance.vnode.el as HTMLElement;
    }
    return null;
}

export type Container = Element | DocumentFragment;
let app: Root | null;

export function render(
    element: ReactNode,
    container: Container | null,
    callback?: () => void
): void {
    if (container) {
        app = createRoot(container);
        app.render(element)
        callback?.()
    }
}

export function unmountComponentAtNode(_container: Container): boolean {
    app?.unmount()
    return true;
}

export function createPortal(children: ReactNode, container: Container, key?: null | string): ReactPortal {
    // 返回一个标记为 Portal 的 ReactElement，toVNode 会翻译为 Teleport vnode
    return {
        $$typeof: REACT_PORTAL_TYPE,
        type: REACT_PORTAL_TYPE,
        key: key ?? null,
        ref: null,
        props: {children, containerInfo: container},
        _owner: null,
    } as any
}

export function flushSync<R>(fn: () => R): R {
    unstable_batchedUpdates(() => {
    })
    return fn();
}

export function unstable_batchedUpdates(callback: () => any): void {
    callback();
    const ins = getCurrentInstance();
    ins?.update();
}