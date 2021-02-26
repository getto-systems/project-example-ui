import { ApplicationStateAction, ActionStateSubscriber, ActionStateHandler } from "./action"

// TODO ApplicationMockAction に置き換えて削除
export abstract class MockAction<S> implements ApplicationStateAction<S> {
    abstract readonly initialState: S

    state: S | null = null

    handler: ActionStateHandler<S> | null = null

    subscriber: ActionStateSubscriber<S> = {
        subscribe: (handler: ActionStateHandler<S>) => {
            if (this.state !== null) {
                handler(this.state)
            }
            this.handler = handler
        },
        unsubscribe: () => {
            this.handler = null
        },
    }
    ignite(): void {
        // mock では特に何もしない
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
    handlers: ActionStateHandler<P>[] = []

    addPropsHandler(handler: ActionStateHandler<P>): void {
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
