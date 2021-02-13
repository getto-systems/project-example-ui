import { delayed } from "../../../../z_infra/delayed/core"

import { login } from "../impl/core"

import { LoginRemoteAccess, PasswordLoginActionConfig } from "../infra"

import { LoginAction } from "../action"

export function initTestPasswordLoginAction(
    config: PasswordLoginActionConfig,
    access: LoginRemoteAccess
): LoginAction {
    return {
        login: login({
            login: access,
            config: config.login,
            delayed,
        }),
    }
}
