import { ErrorComponent } from "./component"

export function initMockErrorComponent(): ErrorMockComponent {
    return new ErrorMockComponent()
}

class ErrorMockComponent implements ErrorComponent {
    notify(): void {
        // mock ではなにもしない
    }
}
