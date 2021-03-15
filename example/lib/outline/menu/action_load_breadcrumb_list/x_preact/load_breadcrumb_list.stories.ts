import { h } from "preact"

import { enumKeys, storyTemplate } from "../../../../z_vendor/storybook/preact/story"

import { LoadBreadcrumbListComponent } from "./load_breadcrumb_list"

import { initMockBreadcrumbList, initMockLoadBreadcrumbListCoreAction } from "../core/mock"

enum LoadEnum {
    "home",
    "empty",
}

export default {
    title: "library/Outline/Load Breadcrumb List",
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
    return h(LoadBreadcrumbListComponent, {
        breadcrumbList: initMockLoadBreadcrumbListCoreAction(initMockBreadcrumbList(props.label)),
    })
})

export const LoadBreadcrumbList = template({ load: "home", label: "ホーム" })
