import { ApplicationAction, ApplicationStateHandler } from "./action"

export class ApplicationAbstractAction<S> implements ApplicationAction<S> {
    handlers: ApplicationStateHandler<S>[] = []

    igniteHooks: IgniteHookList = { ignite: false, hooks: [] }
    terminateHooks: ApplicationHook[] = []

    addStateHandler(handler: ApplicationStateHandler<S>): void {
        this.handlers = [...this.handlers, handler]
    }
    removeStateHandler(target: ApplicationStateHandler<S>): void {
        this.handlers = this.handlers.filter((handler) => handler !== target)
    }

    post(state: S): void {
        this.handlers.forEach((post) => post(state))
    }

    igniteHook(hook: ApplicationHook): void {
        if (this.igniteHooks.ignite) {
            console.warn("igniteHook IGNORED: ignite hook added in ignite hook")
            return
        }
        this.igniteHooks = { ignite: false, hooks: [...this.igniteHooks.hooks, hook] }
    }
    ignite(): void {
        // 同期的にすべての state handler を追加した後で ignite するための setTimeout
        setTimeout(() => {
            // 一回 ignite したら ignite 済みとしてマーク
            // addStateHandler + ignite が複数の箇所からコールされることを想定している
            if (!this.igniteHooks.ignite) {
                const hooks = this.igniteHooks.hooks
                this.igniteHooks = { ignite: true }
                hooks.forEach((hook) => hook())
            }
        })
    }

    terminateHook(hook: ApplicationHook): void {
        this.terminateHooks = [...this.terminateHooks, hook]
    }
    terminate(): void {
        this.handlers = []
        this.terminateHooks.forEach((terminate) => terminate())
    }
}

export interface ApplicationHook {
    (): void
}

type IgniteHookList =
    | Readonly<{ ignite: false; hooks: ApplicationHook[] }>
    | Readonly<{ ignite: true }>
