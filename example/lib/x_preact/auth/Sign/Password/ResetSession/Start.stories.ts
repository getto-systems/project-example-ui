import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../z_storybook/story"

import { PasswordResetSession } from "./Start"

import { initMockPropsPasser } from "../../../../../z_getto/application/mock"

import { initMockPasswordResetSessionEntryPoint } from "../../../../../auth/z_EntryPoint/Sign/mock"

import { formValidationStates } from "../../../../../z_getto/getto-form/x_Resource/Form/mock"
import { loginIDFormFieldValidations } from "../../../../../auth/common/x_Component/Field/LoginID/mock"
import { StartPasswordResetSessionResourceMockProps } from "../../../../../auth/x_Resource/Sign/Password/ResetSession/Start/mock"

export default {
    title: "Auth/Sign/Password/ResetSession/Start",
    argTypes: {
        type: {
            table: { disable: true },
        },
        validation: {
            control: { type: "select", options: formValidationStates },
        },
        loginIDValidation: {
            control: { type: "select", options: loginIDFormFieldValidations },
        },
    },
}

type MockProps = StartPasswordResetSessionResourceMockProps
const template = storyTemplate<MockProps>((args) => {
    const passer = initMockPropsPasser<StartPasswordResetSessionResourceMockProps>()
    const entryPoint = initMockPasswordResetSessionEntryPoint(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.update(props.args)
        })
        return h(PasswordResetSession, entryPoint)
    }
})

const defaultArgs = {
    validation: "initial",
    loginID: "",
    loginIDValidation: "ok",
} as const

export const Initial = template({ ...defaultArgs, type: "initial" })
export const Try = template({ ...defaultArgs, type: "try" })
export const Delayed = template({ ...defaultArgs, type: "delayed" })
export const ValidationError = template({ ...defaultArgs, type: "validation-error" })
export const BadRequest = template({ ...defaultArgs, type: "bad-request" })
export const Invalid = template({ ...defaultArgs, type: "invalid" })
export const ServerError = template({ ...defaultArgs, type: "server-error" })
export const BadResponse = template({
    ...defaultArgs,
    type: "bad-response",
    err: "bad response error",
})
export const InfraError = template({
    ...defaultArgs,
    type: "infra-error",
    err: "infra error",
})
export const Check = template({ ...defaultArgs, type: "check" })
export const Waiting = template({ ...defaultArgs, type: "waiting" })
export const Sending = template({ ...defaultArgs, type: "sending" })
export const CheckBadRequest = template({ ...defaultArgs, type: "check-bad-request" })
export const CheckInvalid = template({ ...defaultArgs, type: "check-invalid" })
export const CheckServerError = template({ ...defaultArgs, type: "check-server-error" })
export const CheckBadResponse = template({
    ...defaultArgs,
    type: "check-bad-response",
    err: "bad response error",
})
export const CheckInfraError = template({
    ...defaultArgs,
    type: "check-infra-error",
    err: "infra error",
})
export const SendError = template({
    ...defaultArgs,
    type: "send-error",
    err: "send error",
})
export const Send = template({ ...defaultArgs, type: "send" })
