import { RenewClient, RenewResponse } from "../../../infra"

import { AuthCredential, TicketNonce } from "../../../../../common/credential/data"

export function initSimulateRenewClient(simulator: RenewSimulator): RenewClient {
    return new SimulateRenewClient(simulator)
}

export interface RenewSimulator {
    // エラーにする場合は RenewError を throw (それ以外を throw するとこわれる)
    renew(ticketNonce: TicketNonce): Promise<AuthCredential | null>
}

class SimulateRenewClient implements RenewClient {
    simulator: RenewSimulator

    constructor(simulator: RenewSimulator) {
        this.simulator = simulator
    }

    async renew(ticketNonce: TicketNonce): Promise<RenewResponse> {
        try {
            const response = await this.simulator.renew(ticketNonce)
            if (!response) {
                return { success: true, hasCredential: false }
            }
            return {
                success: true,
                hasCredential: true,
                authCredential: response,
            }
        } catch (err) {
            return { success: false, err }
        }
    }
}
