import { LoginIDField, LoginIDFieldAction } from "../../../field/login_id/action"

import { LoginIDFieldComponentState } from "./data"

import { LoginID } from "../../../credential/data"
import { Content } from "../../../input/data"

export interface LoginIDFieldComponentAction {
    loginIDField: LoginIDFieldAction
}
