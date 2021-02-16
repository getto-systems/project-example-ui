import {
    PasswordResetRegisterComponent,
    PasswordResetRegisterMaterial,
} from "../../../../../../sign/x_Component/Password/Reset/Register/Reset/component"
import {
    PasswordResetRegisterFormComponent,
    PasswordResetRegisterFormMaterial,
} from "../../../../../../sign/x_Component/Password/Reset/Register/Form/component"

export type AuthSignPasswordResetResource = Readonly<{
    register: PasswordResetRegisterComponent
    form: PasswordResetRegisterFormComponent
}>

export type AuthSignPasswordResetMaterial = Readonly<{
    register: PasswordResetRegisterMaterial
    form: PasswordResetRegisterFormMaterial
}>
