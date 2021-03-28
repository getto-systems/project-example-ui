import { ApplicationAbstractStateAction } from "./impl"

import { ApplicationStateAction } from "./action"

export abstract class ApplicationMockStateAction<S>
    extends ApplicationAbstractStateAction<S>
    implements ApplicationStateAction<S> {
    addMockIgniter(igniter: MockIgniter<S>): void {
        this.igniteHook(() => this.post(igniter()))
    }
}
interface MockIgniter<S> {
    (): S
}
