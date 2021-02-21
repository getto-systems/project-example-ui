import { ApplicationHook } from "../data"
import { TerminateHook } from "../infra"

export function newTerminateHook(): TerminateHook {
    return new Hook()
}

class Hook implements TerminateHook {
    hooks: ApplicationHook[] = []

    register(hook: ApplicationHook): void {
        this.hooks = [...this.hooks, hook]
    }
    run(): void {
        this.hooks.forEach((hook) => hook())
    }
}
