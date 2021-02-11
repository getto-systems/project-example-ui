import { h, VNode } from "preact"
import { useEffect } from "preact/hooks"
import { html } from "htm/preact"

import { NotFound } from "../../x_preact/Auth/NotFound"

import { initMockPropsPasser } from "../../sub/getto-example/x_components/Application/mock"
import { newMockNotFound } from "../../auth/x_components/NotFound/EntryPoint/mock"
import { CurrentVersionMockProps } from "../../auth/x_components/NotFound/currentVersion/mock"

export default {
    title: "Auth/NotFound",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = {
    // no props
}
const Template: Story<MockProps> = (args) => {
    const passer = initMockPropsPasser<CurrentVersionMockProps>()
    const notFound = newMockNotFound(passer)
    return h(Preview, { args })

    function Preview(_: { args: MockProps }) {
        useEffect(() => {
            passer.update({ type: "success" })
        })
        return html`
            <style>
                .sb-main-padded {
                    padding: 0 !important;
                }
            </style>
            ${h(NotFound, { notFound })}
        `
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Initial = Template.bind({})
Initial.args = {}
