import {
    PasswordResetSessionActionSet,
    PasswordResetSessionComponent,
    PasswordResetSessionState,
    PasswordResetSessionRequest,
} from "./component"

import { StartSessionEvent, PollingStatusEvent } from "../../../password_reset/data"

export function initPasswordResetSession(
    background: PasswordResetSessionActionSet
): PasswordResetSessionComponent {
    return new Component(background)
}

class Component implements PasswordResetSessionComponent {
    background: PasswordResetSessionActionSet

    listener: Post<PasswordResetSessionState>[] = []

    constructor(background: PasswordResetSessionActionSet) {
        this.background = background
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
                this.background.startSession((event) => {
                    this.post(this.mapStartSessionEvent(event))
                })
                return
        }
    }

    mapStartSessionEvent(event: StartSessionEvent): PasswordResetSessionState {
        switch (event.type) {
            case "succeed-to-start-session":
                this.background.pollingStatus(event.sessionID, (event) => {
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
