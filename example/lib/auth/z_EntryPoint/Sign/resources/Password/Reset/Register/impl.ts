import { AuthSignPasswordResetMaterial, AuthSignPasswordResetResource } from "./resource"

import { initPasswordResetRegisterComponent } from "../../../../../../sign/x_Component/Password/Reset/Register/Reset/impl"
import { initPasswordResetRegisterFormComponent } from "../../../../../../sign/x_Component/Password/Reset/Register/Form/impl"

export function initPasswordResetResource(
    material: AuthSignPasswordResetMaterial
): AuthSignPasswordResetResource {
    return {
        register: initPasswordResetRegisterComponent(material.register),
        form: initPasswordResetRegisterFormComponent(material.form),
    }
}
