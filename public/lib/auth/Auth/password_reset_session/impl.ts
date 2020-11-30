import {
    PasswordResetSessionActionSet,
    PasswordResetSessionComponent,
    PasswordResetSessionState,
} from "./component"

import { StartSessionEvent, CheckStatusEvent } from "../../password_reset/data"
import { AuthLink } from "../link"

export function initPasswordResetSession(
    actions: PasswordResetSessionActionSet
): PasswordResetSessionComponent {
    return new Component(actions)
}

class Component implements PasswordResetSessionComponent {
    actions: PasswordResetSessionActionSet

    listener: Post<PasswordResetSessionState>[] = []

    link: AuthLink

    constructor(actions: PasswordResetSessionActionSet) {
        this.actions = actions
        this.link = actions.link
    }

    onStateChange(post: Post<PasswordResetSessionState>): void {
        this.listener.push(post)
    }
    post(state: PasswordResetSessionState): void {
        this.listener.forEach((post) => post(state))
    }

    startSession(): void {
        this.actions.startSession((event) => {
            this.post(this.mapStartSessionEvent(event))
        })
    }

    mapStartSessionEvent(event: StartSessionEvent): PasswordResetSessionState {
        switch (event.type) {
            case "succeed-to-start-session":
                this.actions.checkStatus(event.sessionID, (event) => {
                    this.post(this.mapCheckStatusEvent(event))
                })
                return { type: "try-to-check-status" }

            default:
                return event
        }
    }
    mapCheckStatusEvent(event: CheckStatusEvent): PasswordResetSessionState {
        return event
    }
}

interface Post<T> {
    (state: T): void
}
