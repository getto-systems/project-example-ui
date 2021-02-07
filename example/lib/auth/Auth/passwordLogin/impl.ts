import { ApplicationBaseComponent } from "../../../sub/getto-example/application/impl"

import { LoginLink } from "../link"

import {
    PasswordLoginComponentFactory,
    PasswordLoginMaterial,
    PasswordLoginComponent,
    PasswordLoginState,
    PasswordLoginFormComponentFactory,
    PasswordLoginFormComponent,
    PasswordLoginFormMaterial,
    LoginIDFormFieldComponent,
    PasswordFormFieldComponent,
    PasswordFormFieldState,
} from "./component"

import { LoadError } from "../../common/application/data"
import { AuthCredential } from "../../common/credential/data"
import { storeAuthCredential } from "../../login/renew/data"
import { FormConvertResult } from "../../../sub/getto-form/data"
import { LoginFields } from "../../login/passwordLogin/data"
import { LoginIDFieldError } from "../../common/field/loginID/data"
import { LoginIDFormField } from "../../common/field/loginID/action"
import {
    FormBaseComponent,
    FormFieldBaseComponent,
    FormFieldHandler,
} from "../../../sub/getto-form/component/impl"
import { FormFieldEmptyState, FormInputComponent } from "../../../sub/getto-form/component/component"
import {
    PasswordCharacterChecker,
    PasswordFormField,
    PasswordViewer,
} from "../../common/field/password/action"
import { PasswordFieldError, PasswordView } from "../../common/field/password/data"

export const initPasswordLoginComponent: PasswordLoginComponentFactory = (material) =>
    new Component(material)

class Component extends ApplicationBaseComponent<PasswordLoginState> implements PasswordLoginComponent {
    material: PasswordLoginMaterial

    link: LoginLink

    constructor(material: PasswordLoginMaterial) {
        super()
        this.material = material
        this.link = material.link
    }

    login(): void {
        this.material.login((event) => {
            switch (event.type) {
                case "succeed-to-login":
                    this.setContinuousRenew(event.authCredential, () => {
                        this.post({ type: "try-to-load", scriptPath: this.secureScriptPath() })
                    })
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
    loadError(err: LoadError): void {
        this.post({ type: "load-error", err })
    }

    secureScriptPath() {
        return this.material.secureScriptPath()
    }
    setContinuousRenew(authCredential: AuthCredential, hook: { (): void }): void {
        this.material.setContinuousRenew(storeAuthCredential(authCredential), (event) => {
            switch (event.type) {
                case "succeed-to-set-continuous-renew":
                    hook()
                    return

                default:
                    this.post(event)
                    return
            }
        })
    }
}

export const initPasswordLoginFormComponent: PasswordLoginFormComponentFactory = (material) =>
    new FormComponent(material)

class FormComponent
    extends FormBaseComponent<PasswordLoginFormMaterial>
    implements PasswordLoginFormComponent {
    readonly loginID: LoginIDFormFieldComponent
    readonly password: PasswordFormFieldComponent

    constructor(material: PasswordLoginFormMaterial) {
        super(material)

        this.loginID = this.initField("loginID", initField_loginID({ field: material.loginID }))
        this.password = this.initField(
            "password",
            initField_password({
                field: material.password,
                checker: material.checker,
                viewer: material.viewer,
            })
        )
    }

    getLoginFields(): FormConvertResult<LoginFields> {
        this.loginID.validate()
        this.password.validate()

        const result = {
            loginID: this.material.loginID.convert(),
            password: this.material.password.convert(),
        }
        if (!result.loginID.success || !result.password.success) {
            return { success: false }
        }
        return {
            success: true,
            value: {
                loginID: result.loginID.value,
                password: result.password.value,
            },
        }
    }
}

function initField_loginID(
    material: FieldMaterial_loginID
): { (handler: FormFieldHandler): LoginIDFormFieldComponent } {
    return (handler) => new FieldComponent_loginID(material, handler)
}

type FieldMaterial_loginID = Readonly<{
    field: LoginIDFormField
}>
class FieldComponent_loginID
    extends FormFieldBaseComponent<FormFieldEmptyState, LoginIDFieldError>
    implements LoginIDFormFieldComponent {
    readonly input: FormInputComponent

    constructor(material: FieldMaterial_loginID, handler: FormFieldHandler) {
        super(handler, {
            state: () => ({ result: material.field.validate() }),
        })
        this.input = this.initInput("input", material.field)
    }
}

function initField_password(
    material: FieldMaterial_password
): { (handler: FormFieldHandler): PasswordFormFieldComponent } {
    return (handler) => new FieldComponent_password(material, handler)
}

type FieldMaterial_password = Readonly<{
    field: PasswordFormField
    checker: PasswordCharacterChecker
    viewer: PasswordViewer
}>
class FieldComponent_password
    extends FormFieldBaseComponent<PasswordFormFieldState, PasswordFieldError>
    implements PasswordFormFieldComponent {
    readonly input: FormInputComponent
    material: FieldMaterial_password

    constructor(material: FieldMaterial_password, handler: FormFieldHandler) {
        super(handler, {
            state: () => {
                const password = material.field.input.get()
                return {
                    result: material.field.validate(),
                    character: material.checker(password),
                    view: view(),
                }

                function view(): PasswordView {
                    if (material.viewer.get().show) {
                        return { show: true, password }
                    } else {
                        return { show: false }
                    }
                }
            },
        })
        this.input = this.initInput("input", material.field)
        this.material = material
    }

    show(): void {
        this.material.viewer.show(() => {
            this.validate()
        })
    }
    hide(): void {
        this.material.viewer.hide(() => {
            this.validate()
        })
    }
}
