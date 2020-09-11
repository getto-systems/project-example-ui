import { CheckClient, CheckResponse } from "../../../infra"

import { ScriptPath } from "../../../data"

export function initSimulateCheckClient(returnResponse: CheckResponse): CheckClient {
    return new SimulateCheckClient(returnResponse)
}

class SimulateCheckClient implements CheckClient {
    returnResponse: CheckResponse

    constructor(returnResponse: CheckResponse) {
        this.returnResponse = returnResponse
    }

    checkStatus(_scriptPath: ScriptPath): Promise<CheckResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.returnResponse)
            }, 5 * 1000)
        })
    }
}
