import {
    BackgroundCredentialComponent,
} from "./component"

import { CredentialAction } from "../../credential/action"

import { FetchResponse } from "../../credential/data"

interface Action {
    credential: CredentialAction
}

export function initBackgroundCredentialComponent(action: Action): BackgroundCredentialComponent {
    return new Component(action)
}

class Component implements BackgroundCredentialComponent {
    action: Action

    constructor(action: Action) {
        this.action = action
    }

    fetch(): FetchResponse {
        return this.action.credential.fetch()
    }
}
