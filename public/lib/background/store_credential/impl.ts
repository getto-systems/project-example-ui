import {
    StoreCredentialComponent,
    StoreCredentialComponentResource,
    StoreCredentialOperation,
    StoreCredentialOperationPubSub,
    StoreCredentialOperationSubscriber,
    StoreEventSubscriber,
} from "./component"

import { CredentialAction } from "../../credential/action"

import { FetchResponse } from "../../credential/data"

interface Action {
    credential: CredentialAction
}

export function initStoreCredentialComponent(action: Action): StoreCredentialComponentResource {
    const pubsub = initStoreCredentialOperationPubSub()
    return {
        component: new Component(action, pubsub.sub),
        send: pubsub.send,
    }
}
export function initStoreCredentialOperationPubSub(): StoreCredentialOperationPubSub {
    const pubsub = new OperationPubSub()
    return {
        send: operation => pubsub.send(operation),
        sub: pubsub,
    }
}

class Component implements StoreCredentialComponent {
    action: Action
    sub: StoreEventSubscriber

    constructor(action: Action, operationSubscriber: StoreCredentialOperationSubscriber) {
        this.action = action
        this.sub = this.action.credential.sub

        operationSubscriber.handleOperation(operation => this.send(operation))
    }
    send(operation: StoreCredentialOperation): void {
        this.action.credential.storeCredential(operation.authCredential)
    }

    fetch(): FetchResponse {
        return this.action.credential.fetch()
    }
}

class OperationPubSub implements StoreCredentialOperationSubscriber {
    listener: Post<StoreCredentialOperation>[] = []

    send(operation: StoreCredentialOperation): void {
        this.listener.forEach(post => post(operation))
    }

    handleOperation(post: Post<StoreCredentialOperation>): void {
        this.listener.push(post)
    }
}

interface Post<T> {
    (state: T): void
}
