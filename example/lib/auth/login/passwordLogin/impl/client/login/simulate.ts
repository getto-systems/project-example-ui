import { LoginClient, LoginResponse, loginSuccess, loginFailed } from "../../../infra"

import { LoginFields } from "../../../data"
import { AuthCredential } from "../../../../../common/credential/data"

export function initSimulatePasswordLoginClient(simulator: LoginSimulator): LoginClient {
    return new SimulatePasswordLoginClient(simulator)
}

export interface LoginSimulator {
    // エラーにする場合は LoginError を throw (それ以外を throw するとこわれる)
    login(fields: LoginFields): Promise<AuthCredential>
}

class SimulatePasswordLoginClient implements LoginClient {
    simulator: LoginSimulator

    constructor(simulator: LoginSimulator) {
        this.simulator = simulator
    }

    async login(fields: LoginFields): Promise<LoginResponse> {
        try {
            return loginSuccess(await this.simulator.login(fields))
        } catch (err) {
            return loginFailed(err)
        }
    }
}
