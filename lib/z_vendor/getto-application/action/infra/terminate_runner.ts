import { ActionTerminateHook, ActionTerminateRunner } from "../infra"

export function initActionTerminateRunner(): ActionTerminateRunner {
    return new Runner()
}

class Runner implements ActionTerminateRunner {
    hooks: ActionTerminateHook[] = []

    register(hook: ActionTerminateHook): void {
        this.hooks = [...this.hooks, hook]
    }
    terminate(): void {
        this.hooks.forEach((hook) => hook())
    }
}
