import type {
    ReactInstance,
    ReactNode,
    ReactPortal
} from './index';
import {createRoot, type Root} from './client'
import {Teleport, createVNode, getCurrentInstance} from 'vue'

export const version = "18.0.2";

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
    return createVNode(Teleport, {to: container, key: key || ""}, children)
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