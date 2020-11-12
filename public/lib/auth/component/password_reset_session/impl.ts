import {
    PasswordResetSessionActionSet,
    PasswordResetSessionComponent,
    PasswordResetSessionState,
    PasswordResetSessionRequest,
} from "./component"

import { StartSessionEvent, PollingStatusEvent } from "../../../password_reset/data"

export function initPasswordResetSession(
    actions: PasswordResetSessionActionSet
): PasswordResetSessionComponent {
    return new Component(actions)
}

class Component implements PasswordResetSessionComponent {
    actions: PasswordResetSessionActionSet

    listener: Post<PasswordResetSessionState>[] = []

    constructor(actions: PasswordResetSessionActionSet) {
        this.actions = actions
    }

    onStateChange(post: Post<PasswordResetSessionState>): void {
        this.listener.push(post)
    }
    post(state: PasswordResetSessionState): void {
        this.listener.forEach((post) => post(state))
    }

    action(request: PasswordResetSessionRequest): void {
        switch (request.type) {
            case "start-session":
                this.actions.startSession((event) => {
                    this.post(this.mapStartSessionEvent(event))
                })
                return
        }
    }

    mapStartSessionEvent(event: StartSessionEvent): PasswordResetSessionState {
        switch (event.type) {
            case "succeed-to-start-session":
                this.actions.pollingStatus(event.sessionID, (event) => {
                    this.post(this.mapPollingStatusEvent(event))
                })
                return { type: "try-to-polling-status" }

            default:
                return event
        }
    }
    mapPollingStatusEvent(event: PollingStatusEvent): PasswordResetSessionState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
