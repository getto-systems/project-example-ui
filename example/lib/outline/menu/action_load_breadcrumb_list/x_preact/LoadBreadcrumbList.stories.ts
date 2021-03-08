import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../z_vendor/storybook/preact/story"

import { LoadBreadcrumbList } from "./LoadBreadcrumbList"

import { initMockBreadcrumbList, initMockLoadBreadcrumbListCoreAction } from "../core/mock"

enum LoadEnum {
    "home",
    "empty",
}

export default {
    title: "library/Outline/LoadBreadcrumbList",
    argTypes: {
        load: {
            control: { type: "select", options: enumKeys(LoadEnum) },
        },
    },
}

type MockProps = Readonly<{
    load: keyof typeof LoadEnum
    label: string
}>
const template = storyTemplate<MockProps>((props) => {
    return h(LoadBreadcrumbList, {
        breadcrumbList: initMockLoadBreadcrumbListCoreAction(initMockBreadcrumbList(props.label)),
    })
})

export const Initial = template({ load: "home", label: "ホーム" })
