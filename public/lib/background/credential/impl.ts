import {
    BackgroundCredentialComponent,
    BackgroundCredentialComponentResource,
    BackgroundCredentialOperation,
    BackgroundCredentialOperationPubSub,
    BackgroundCredentialOperationSubscriber,
    BackgroundEventSubscriber,
} from "./component"

import { CredentialAction } from "../../credential/action"

import { FetchResponse } from "../../credential/data"

interface Action {
    credential: CredentialAction
}

export function initBackgroundCredentialComponent(action: Action): BackgroundCredentialComponentResource {
    const pubsub = initBackgroundCredentialOperationPubSub()
    return {
        background: new Component(action, pubsub.sub),
        request: pubsub.request,
    }
}
export function initBackgroundCredentialOperationPubSub(): BackgroundCredentialOperationPubSub {
    const pubsub = new OperationPubSub()
    return {
        request: operation => pubsub.request(operation),
        sub: pubsub,
    }
}

class Component implements BackgroundCredentialComponent {
    action: Action
    sub: BackgroundEventSubscriber

    constructor(action: Action, operationSubscriber: BackgroundCredentialOperationSubscriber) {
        this.action = action
        this.sub = this.action.credential.sub

        operationSubscriber.handleOperation(operation => this.request(operation))
    }
    request(operation: BackgroundCredentialOperation): void {
        this.action.credential.storeCredential(operation.authCredential)
    }

    fetch(): FetchResponse {
        return this.action.credential.fetch()
    }
}

class OperationPubSub implements BackgroundCredentialOperationSubscriber {
    listener: Post<BackgroundCredentialOperation>[] = []

    request(operation: BackgroundCredentialOperation): void {
        this.listener.forEach(post => post(operation))
    }

    handleOperation(post: Post<BackgroundCredentialOperation>): void {
        this.listener.push(post)
    }
}

interface Post<T> {
    (state: T): void
}
