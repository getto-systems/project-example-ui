import { ApplicationStateAction, ApplicationStateIgnition } from "./action"

import { ApplicationStateHandler } from "./data"

export class MockStateAction_simple<S> implements ApplicationStateAction<S> {
    ignition(): ApplicationStateIgnition<S> {
        return {
            subscribe() {
                // mock では特に何もしない
            },
            unsubscribe() {
                // mock では特に何もしない
            },
            ignite() {
                // mock では特に何もしない
            },
        }
    }

    terminate(): void {
        // mock では特に何もしない
    }
}

export class MockAction<S> implements ApplicationStateAction<S> {
    state: S | null = null

    handler: ApplicationStateHandler<S> | null = null

    ignition(): ApplicationStateIgnition<S> {
        return {
            subscribe: (handler: ApplicationStateHandler<S>) => {
                if (this.state !== null) {
                    handler(this.state)
                }
                this.handler = handler
            },
            unsubscribe: () => {
                this.handler = null
            },
            ignite() {
                // mock では特に何もしない
            },
        }
    }

    post(state: S): void {
        this.state = state
        if (this.handler !== null) {
            this.handler(state)
        }
    }

    terminate(): void {
        this.handler = null
    }
}

export function initMockPropsPasser<P>(): MockPropsPasser<P> {
    return new Passer()
}

export function mapMockPropsPasser<B, P>(
    base: MockPropsPasser<B>,
    map: MockPropsMapper<B, P>,
): MockPropsPasser<P> {
    return new MappedPasser(base, map)
}

export interface MockPropsPasser<P> {
    addPropsHandler(handler: Handler<P>): void
    update(state: P): void
}

class Passer<P> implements MockPropsPasser<P> {
    handlers: ApplicationStateHandler<P>[] = []

    addPropsHandler(handler: ApplicationStateHandler<P>): void {
        this.handlers = [...this.handlers, handler]
    }
    update(state: P): void {
        this.handlers.forEach((post) => post(state))
    }
}

class MappedPasser<B, P> extends Passer<P> implements MockPropsPasser<P> {
    constructor(base: MockPropsPasser<B>, map: MockPropsMapper<B, P>) {
        super()
        base.addPropsHandler((props) => {
            this.update(map(props))
        })
    }
}

interface MockPropsMapper<B, P> {
    (props: B): P
}

interface Handler<P> {
    (props: P): void
}
