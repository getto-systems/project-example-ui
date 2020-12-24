import { h, VNode } from "preact"
import { html } from "htm/preact"

import {
    mapSeasonMockProps,
    SeasonMockProps,
    initSeason,
} from "../../../example/shared/Outline/season/mock"

import { initialSeasonState } from "../../../example/shared/Outline/season/component"

import { SeasonInfo } from "../../../x_preact/secure/Outline/SeasonInfo"

export default {
    title: "secure/Outline/SeasonInfo",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = SeasonMockProps
const Template: Story<MockProps> = (args) => {
    const season = initSeason(initialSeasonState)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        season.update(mapSeasonMockProps(props.args))
        return html`<main class="layout">
            <aside class="layout__menu menu">
                ${h(SeasonInfo, { season })}
            </aside>
        </main>`
    }
}

interface Story<T> {
    args?: T
    (args: T): VNode
}

export const Success = Template.bind({})
Success.args = {
    type: "success",
    year: new Date().getFullYear(),
}

export const Failed = Template.bind({})
Failed.args = {
    type: "failed",
    err: "load error",
}
