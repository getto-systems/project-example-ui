import { CheckClient, CheckResponse } from "../../../infra"

import { Version } from "../../../data"

export function initSimulateCheckClient(simulator: CheckSimulator): CheckClient {
    return new Client(simulator)
}

export interface CheckSimulator {
    // エラーにする場合は CheckError を throw する（そうじゃないとこわれる）
    check(version: Version): Promise<boolean>
}

class Client implements CheckClient {
    simulator: CheckSimulator

    constructor(simulator: CheckSimulator) {
        this.simulator = simulator
    }

    async check(version: Version): Promise<CheckResponse> {
        try {
            const found = await this.simulator.check(version)
            if (!found) {
                return { success: true, found: false }
            }
            return { success: true, found: true, version }
        } catch (err) {
            return { success: false, err }
        }
    }
}
