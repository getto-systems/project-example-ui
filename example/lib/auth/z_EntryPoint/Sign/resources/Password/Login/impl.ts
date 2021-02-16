import { initPasswordLoginFormComponent } from "../../../../../sign/x_Component/Password/Login/Form/impl"
import { initPasswordLoginComponent } from "../../../../../sign/x_Component/Password/Login/Core/impl"

import { AuthSignPasswordLoginMaterial, AuthSignPasswordLoginResource } from "./resource"


export function initAuthSignPasswordLoginResource(
    material: AuthSignPasswordLoginMaterial
): AuthSignPasswordLoginResource {
    return {
        login: initPasswordLoginComponent(material.login),
        form: initPasswordLoginFormComponent(material.form),
    }
}
