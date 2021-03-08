import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../z_vendor/storybook/preact/story"
import { noPaddedStory } from "../../../z_vendor/storybook/preact/display"

import { EntryPoint } from "./EntryPoint"

import { initMockPropsPasser } from "../../../z_vendor/getto-application/action/mock"
import {
    DashboardMockPropsPasser,
    newMockDashboard,
} from "../../../example/x_components/Dashboard/EntryPoint/mock"
import { SeasonInfoMockProps } from "../../../example/x_components/Outline/seasonInfo/mock"
import { ExampleMockProps } from "../../../example/x_components/Dashboard/example/mock"

export default {
    title: "Example/Home/Dashboard",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
}

type MockProps = Readonly<{
    seasonYear: number
}>
const template = storyTemplate<MockProps>((args) => {
    const passer: DashboardMockPropsPasser = {
        seasonInfo: initMockPropsPasser<SeasonInfoMockProps>(),
        example: initMockPropsPasser<ExampleMockProps>(),
    }
    const entryPoint = newMockDashboard(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.seasonInfo.update({ type: "success", year: props.args.seasonYear })
            passer.example.update({ type: "success", year: props.args.seasonYear })
        })
        return noPaddedStory(h(EntryPoint, entryPoint))
    }
})

export const Initial = template({
    seasonYear: new Date().getFullYear(),
})
