import {
    PasswordLoginComponent,
    PasswordLoginMaterial,
} from "../../../../../sign/x_Action/Password/Login/Core/component"
import {
    PasswordLoginFormComponent,
    PasswordLoginFormMaterial,
} from "../../../../../sign/x_Action/Password/Login/Form/component"

export type AuthSignPasswordLoginResource = Readonly<{
    login: PasswordLoginComponent
    form: PasswordLoginFormComponent
}>

export type AuthSignPasswordLoginMaterial = Readonly<{
    login: PasswordLoginMaterial
    form: PasswordLoginFormMaterial
}>
