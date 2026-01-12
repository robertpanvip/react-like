import type React from './index'
import {createApp, App} from 'vue'

export interface RootOptions {
    identifierPrefix?: string;
    onRecoverableError?: (error: unknown) => void;
}

export interface Root {
    render(children: React.ReactNode): void;

    unmount(): void;
}

export function createRoot(container: Element | DocumentFragment, _options?: RootOptions): Root {
    let app: App|null = null;
    return {
        render(children: React.ReactNode) {
            const App = () => children
            app = createApp(App, {})
            app.mount(container)
        },
        unmount() {
            return app?.unmount();
        }
    }
}
