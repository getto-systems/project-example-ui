import { MenuBadgeClient, MenuBadgeResponse, MenuBadge } from "../../../infra"

import { ApiNonce } from "../../../../../common/credential/data"

export function initSimulateMenuBadgeClient(simulator: MenuBadgeSimulator): MenuBadgeClient {
    return new SimulateMenuBadgeClient(simulator)
}

export interface MenuBadgeSimulator {
    // エラーにする場合は MenuBadgeError を throw する（それ以外だとこわれる）
    getMenuBadge(apiNonce: ApiNonce): Promise<MenuBadge>
}

class SimulateMenuBadgeClient implements MenuBadgeClient {
    simulator: MenuBadgeSimulator

    constructor(simulator: MenuBadgeSimulator) {
        this.simulator = simulator
    }

    async getBadge(apiNonce: ApiNonce): Promise<MenuBadgeResponse> {
        try {
            return { success: true, menuBadge: await this.simulator.getMenuBadge(apiNonce) }
        } catch (err) {
            return { success: false, err }
        }
    }
}
