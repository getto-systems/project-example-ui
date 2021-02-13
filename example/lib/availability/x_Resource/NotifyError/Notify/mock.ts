import { NotifyComponent } from "./component"

export function initMockNotifyComponent(): NotifyComponent {
    return new Component()
}

class Component implements NotifyComponent {
    send(): void {
        // mock ではなにもしない
    }
}
