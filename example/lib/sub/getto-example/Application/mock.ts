import { ApplicationComponent, ApplicationStateHandler } from "./component"

export class MockComponent<S> implements ApplicationComponent<S> {
    state: S | null = null

    handler: ApplicationStateHandler<S> | null = null

    addStateHandler(handler: ApplicationStateHandler<S>): void {
        if (this.state !== null) {
            handler(this.state)
        }
        this.handler = handler
    }
    post(state: S): void {
        this.state = state
        if (this.handler !== null) {
            this.handler(state)
        }
    }
    removeStateHandler(_handler: ApplicationStateHandler<S>): void {
        this.handler = null
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
    map: MockPropsMapper<B, P>
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
