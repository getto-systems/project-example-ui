import { ErrorComponent } from "./component"

export function initMockErrorComponent(): ErrorComponent {
    return new Component()
}

class Component implements ErrorComponent {
    notify(): void {
        // mock ではなにもしない
    }
}
