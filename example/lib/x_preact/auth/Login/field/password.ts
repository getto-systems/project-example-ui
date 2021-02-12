import { h, VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent } from "../../../../z_vendor/getto-css/preact/common"
import {
    field,
    field_error,
    label_password_fill,
} from "../../../../z_vendor/getto-css/preact/design/form"

import { useComponent } from "../../../common/hooks"

import { FormInput } from "../../../common/Form/FormInput"

import {
    initialPasswordFormFieldComponentState,
    PasswordFormFieldComponent,
} from "../../../../auth/x_Resource/common/Field/Password/component"

import { FormInputString, FormValidationResult } from "../../../../sub/getto-form/form/data"
import {
    PasswordValidationError,
    PasswordCharacter,
    PasswordView,
} from "../../../../auth/common/field/password/data"

type Props = Readonly<{
    password: PasswordFormFieldComponent
    help: VNodeContent[]
}>
export function PasswordFormField({ password, help }: Props): VNode {
    const state = useComponent(password, initialPasswordFormFieldComponentState)

    return label_password_fill(content())

    function content() {
        const handler = {
            show: () => password.show(),
            hide: () => password.hide(),
        }

        const content = {
            title: "パスワード",
            body: h(FormInput, { type: "password", input: password.input }),
            help: [...help, passwordView(handler, state.view, state.character)],
        }

        if (state.result.valid) {
            return field(content)
        } else {
            return field_error({
                ...content,
                notice: passwordValidationError(state.result, state.character),
            })
        }
    }
}

function passwordValidationError(
    result: FormValidationResult<PasswordValidationError>,
    character: PasswordCharacter
): VNodeContent[] {
    if (result.valid) {
        return []
    }

    return result.err.map((err) => {
        switch (err) {
            case "empty":
                return ["パスワードを入力してください"]

            case "too-long":
                if (character.complex) {
                    return ["パスワードが長すぎます(18文字程度)"]
                } else {
                    return ["パスワードが長すぎます(72文字以内)"]
                }
        }
    })
}

interface PasswordViewHandler {
    show(): void
    hide(): void
}

function passwordView(
    handler: PasswordViewHandler,
    view: PasswordView,
    character: PasswordCharacter
): VNode {
    if (view.show) {
        return html`
            <a href="#" onClick=${hide}>
                <i class="lnir lnir-key-alt"></i> パスワードを隠す ${characterHelp()}
            </a>
            <p class="form__help">${extractPassword(view.password)}</p>
        `
    } else {
        return html`
            <a href="#" onClick=${show}>
                <i class="lnir lnir-key-alt"></i> パスワードを表示 ${characterHelp()}
            </a>
        `
    }

    function extractPassword(password: FormInputString): string {
        if (password.length === 0) {
            return "(入力されていません)"
        } else {
            return password
        }
    }

    function characterHelp(): string {
        if (character.complex) {
            return "(マルチバイト文字が含まれています)"
        } else {
            return ""
        }
    }

    function show(e: MouseEvent) {
        linkClicked(e)
        handler.show()
    }
    function hide(e: MouseEvent) {
        linkClicked(e)
        handler.hide()
    }
    function linkClicked(e: MouseEvent) {
        e.preventDefault()

        // クリック後 focus 状態になるのでキャンセル
        if (e.target instanceof HTMLElement) {
            e.target.blur()
        }
    }
}
