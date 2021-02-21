import { ApplicationHook } from "../data"
import { IgniteHook } from "../infra"

export function newIgniteHook(): IgniteHook {
    return new Hook()
}

class Hook implements IgniteHook {
    state: IgniteHookState = { done: false, hooks: [] }

    register(hook: ApplicationHook): void {
        if (this.state.done) {
            console.warn("igniteHook IGNORED: hook added in ignite hook")
            return
        }
        this.state = { done: false, hooks: [...this.state.hooks, hook] }
    }
    run(): void {
        // 一回 ignite したら ignite 済みとしてマーク
        // 複数の箇所から複数回コールされても hook の実行は一回だけ
        if (!this.state.done) {
            const hooks = this.state.hooks
            this.state = { done: true }
            hooks.forEach((hook) => hook())
        }
    }
}

type IgniteHookState =
    | Readonly<{ done: false; hooks: ApplicationHook[] }>
    | Readonly<{ done: true }>
