import {
    StoreCredentialComponent,
    StoreCredentialOperation,
    StoreCredentialTrigger,
    StoreCredentialOperator,
    StoreEventSubscriber,
} from "./component"

import { CredentialAction } from "../../credential/action"

import { FetchResponse } from "../../credential/data"

interface Action {
    credential: CredentialAction
}

export function initStoreCredentialComponent(action: Action): { component: StoreCredentialComponent, trigger: StoreCredentialTrigger } {
    const pubsub = initStoreCredentialOperationPubSub()
    return {
        component: new Component(action, pubsub.operator),
        trigger: pubsub.trigger,
    }
}
export function initStoreCredentialOperationPubSub(): { trigger: StoreCredentialTrigger, operator: StoreCredentialOperator } {
    const pubsub = new OperationPubSub()
    return {
        trigger: pubsub,
        operator: pubsub,
    }
}

class Component implements StoreCredentialComponent {
    action: Action
    sub: StoreEventSubscriber

    constructor(action: Action, operator: StoreCredentialOperator) {
        this.action = action
        this.sub = this.action.credential.sub

        operator.onTrigger(operation => this.trigger(operation))
    }
    trigger(operation: StoreCredentialOperation): void {
        this.action.credential.storeCredential(operation.authCredential)
    }

    fetch(): FetchResponse {
        return this.action.credential.fetch()
    }
}

class OperationPubSub implements StoreCredentialTrigger, StoreCredentialOperator {
    listener: Post<StoreCredentialOperation>[] = []

    trigger(operation: StoreCredentialOperation): void {
        this.listener.forEach(post => post(operation))
    }

    onTrigger(post: Post<StoreCredentialOperation>): void {
        this.listener.push(post)
    }
}

interface Post<T> {
    (state: T): void
}
