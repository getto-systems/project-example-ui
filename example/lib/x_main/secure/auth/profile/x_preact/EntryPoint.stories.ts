import { h } from "preact"
import { useEffect } from "preact/hooks"

import { storyTemplate } from "../../../../../z_vendor/storybook/preact/story"

import { View } from "./EntryPoint"

import { AuthProfileMockPropsPasser, initMockAuthProfileResource } from "../mock"

import { initMockPropsPasser } from "../../../../../z_vendor/getto-application/action/mock"

import { SeasonInfoMockProps } from "../../../../../example/x_components/Outline/seasonInfo/mock"

export default {
    title: "main/secure/Auth/Profile",
    argTypes: {
        type: {
            table: { disable: true },
        },
    },
    parameters: {
        layout: "fullscreen",
    },
}

type MockProps = Readonly<{
    seasonYear: number
    menuBadgeCount: number
    breadcrumbLabel: string
    breadcrumbIcon: string
}>
const template = storyTemplate<MockProps>((args) => {
    const passer: AuthProfileMockPropsPasser = {
        seasonInfo: initMockPropsPasser<SeasonInfoMockProps>(),
    }
    const resource = initMockAuthProfileResource(passer)
    return h(Preview, { args })

    function Preview(props: { args: MockProps }) {
        useEffect(() => {
            passer.seasonInfo.update({ type: "success", year: props.args.seasonYear })
        })
        return h(View, resource)
    }
})

export const Initial = template({
    seasonYear: new Date().getFullYear(),
    menuBadgeCount: 99,
    breadcrumbLabel: "ホーム",
    breadcrumbIcon: "home",
})
