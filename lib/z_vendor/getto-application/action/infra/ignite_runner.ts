import { ApplicationActionIgniteHook, ApplicationActionIgniteRunner } from "../infra"

export function initActionIgniteRunner(): ApplicationActionIgniteRunner {
    return new Runner()
}

class Runner implements ApplicationActionIgniteRunner {
    state: IgniteHookState = { done: false, hooks: [] }

    register(hook: ApplicationActionIgniteHook): void {
        if (this.state.done) {
            console.warn("igniteHook IGNORED: hook added in ignite hook")
            return
        }
        this.state = { done: false, hooks: [...this.state.hooks, hook] }
    }
    ignite(): void {
        // 一回 ignite したら ignite 済みとしてマーク
        // 複数の箇所から複数回コールされても hook の実行は一回だけ
        if (!this.state.done) {
            const hooks = this.state.hooks
            this.state = { done: true }
            hooks.forEach((hook) => hook())
        }
    }
    terminate(): void {
        this.state = { done: true }
    }
}

type IgniteHookState =
    | Readonly<{ done: false; hooks: ApplicationActionIgniteHook[] }>
    | Readonly<{ done: true }>
