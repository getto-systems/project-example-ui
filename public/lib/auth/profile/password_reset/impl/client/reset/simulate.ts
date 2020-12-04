import { PasswordResetClient, ResetResponse, resetSuccess, resetFailed } from "../../../infra"

import { ResetToken, ResetFields } from "../../../data"
import { AuthCredential } from "../../../../../common/credential/data"

export function initSimulatePasswordResetClient(simulator: ResetSimulator): PasswordResetClient {
    return new SimulatePasswordResetClient(simulator)
}

export interface ResetSimulator {
    // エラーにする場合は ResetError を throw (それ以外を throw するとこわれる)
    reset(resetToken: ResetToken, fields: ResetFields): Promise<AuthCredential>
}

class SimulatePasswordResetClient implements PasswordResetClient {
    simulator: ResetSimulator

    constructor(simulator: ResetSimulator) {
        this.simulator = simulator
    }

    async reset(resetToken: ResetToken, fields: ResetFields): Promise<ResetResponse> {
        try {
            return resetSuccess(await this.simulator.reset(resetToken, fields))
        } catch(err) {
            return resetFailed(err)
        }
    }
}
