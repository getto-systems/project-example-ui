import {
    PasswordResetSessionClient,
    SessionResponse,
    startSessionSuccess,
    startSessionFailed,
    SendTokenResponse,
    GetStatusResponse,
    getStatusSend,
    getStatusInProgress,
    getStatusFailed,
    sendTokenSuccess,
    sendTokenFailed,
} from "../../../infra"

import { Destination, StartSessionFields } from "../../../data"

import { SessionID, CheckStatusError } from "../../../data"

export function initSimulatePasswordResetSessionClient(
    simulator: SessionSimulator
): PasswordResetSessionClient {
    return new SimulatePasswordResetSessionClient(simulator)
}

export interface SessionSimulator {
    // エラーにする場合は StartSessionError を throw (それ以外を throw するとこわれる)
    startSession(fields: StartSessionFields): Promise<SessionID>
    // エラーにする場合は CheckStatusError を throw (それ以外を throw するとこわれる)
    sendToken(post: Post<SendTokenState>): Promise<true>
    // エラーにする場合は CheckStatusError を throw (それ以外を throw するとこわれる)
    getDestination(sessionID: SessionID): Promise<Destination>
}

export type SendTokenState =
    | Readonly<{ state: "waiting" }>
    | Readonly<{ state: "sending" }>
    | Readonly<{ state: "success" }>

type TokenState =
    | Readonly<{ state: "initial" }>
    | Readonly<{ state: "waiting" }>
    | Readonly<{ state: "sending" }>
    | Readonly<{ state: "success" }>
    | Readonly<{ state: "failed"; err: CheckStatusError }>

class SimulatePasswordResetSessionClient implements PasswordResetSessionClient {
    simulator: SessionSimulator

    tokenState: TokenState = { state: "initial" }

    constructor(simulator: SessionSimulator) {
        this.simulator = simulator
    }

    async startSession(fields: StartSessionFields): Promise<SessionResponse> {
        try {
            return startSessionSuccess(await this.simulator.startSession(fields))
        } catch (err) {
            return startSessionFailed(err)
        }
    }

    sendTokenStateTo(state: SendTokenState): void {
        this.tokenState = state
    }

    async sendToken(): Promise<SendTokenResponse> {
        try {
            if (await this.simulator.sendToken((state) => this.sendTokenStateTo(state))) {
                return sendTokenSuccess
            }
            throw { type: "infra-error", err: "never" }
        } catch (err) {
            return sendTokenFailed(err)
        }
    }

    async getStatus(sessionID: SessionID): Promise<GetStatusResponse> {
        try {
            const dest = await this.simulator.getDestination(sessionID)

            switch (this.tokenState.state) {
                case "initial":
                case "waiting":
                    return getStatusInProgress(dest, { sending: false })

                case "sending":
                    return getStatusInProgress(dest, { sending: true })

                case "success":
                    return getStatusSend(dest)

                case "failed":
                    return getStatusFailed(this.tokenState.err)
            }
        } catch (err) {
            return getStatusFailed(err)
        }
    }
}

interface Post<T> {
    (state: T): void
}
