import { MenuTestRepository, MenuTestRemoteAccess, newTestMenuResource } from "./core"

import { initMemoryTypedStorage } from "../../../../../z_infra/storage/memory"
import { initApiCredentialRepository } from "../../../../common/credential/impl/repository/apiCredential"
import { initMenuExpandRepository } from "../../../../permission/menu/impl/repository/menuExpand"

import { ApiCredentialRepository } from "../../../../common/credential/infra"
import { MenuExpand, MenuExpandRepository, MenuTree } from "../../../../permission/menu/infra"

import { BreadcrumbListComponentState } from "../../breadcrumbList/component"
import { MenuListComponentState } from "../../menuList/component"

import { markMenuCategoryLabel, Menu } from "../../../../permission/menu/data"
import { markApiCredential } from "../../../../common/credential/data"
import { initLoadMenuBadgeSimulateRemoteAccess } from "../../../../permission/menu/impl/remote/menuBadge/simulate"

describe("BreadcrumbList", () => {
    test("load breadcrumb", (done) => {
        const { resource } = standardMenuResource()

        resource.breadcrumbList.addStateHandler(stateHandler())

        resource.breadcrumbList.load()

        function stateHandler(): Post<BreadcrumbListComponentState> {
            const stack: BreadcrumbListComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-breadcrumb-list":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-load",
                                breadcrumb: [
                                    {
                                        type: "category",
                                        category: { label: "MAIN" },
                                    },
                                    {
                                        type: "item",
                                        item: {
                                            label: "ホーム",
                                            icon: "home",
                                            href: "/1.0.0/index.html",
                                        },
                                    },
                                ],
                            },
                        ])
                        done()
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("load empty breadcrumb; unknown menu target", (done) => {
        const { resource } = unknownMenuResource()

        resource.breadcrumbList.addStateHandler(stateHandler())

        resource.breadcrumbList.load()

        function stateHandler(): Post<BreadcrumbListComponentState> {
            const stack: BreadcrumbListComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-breadcrumb-list":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-load",
                                breadcrumb: [],
                            },
                        ])
                        done()
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })
})

describe("MenuList", () => {
    test("load menu", (done) => {
        const { resource } = standardMenuResource()

        resource.menuList.addStateHandler(stateHandler())

        resource.menuList.load()

        function stateHandler(): Post<MenuListComponentState> {
            const stack: MenuListComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-menu-list":
                    case "succeed-to-instant-load":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-instant-load",
                                menu: [
                                    {
                                        type: "category",
                                        category: { label: "MAIN" },
                                        path: ["MAIN"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ホーム",
                                                    icon: "home",
                                                    href: "/1.0.0/index.html",
                                                },
                                                isActive: true,
                                                badgeCount: 0,
                                            },
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ドキュメント",
                                                    icon: "docs",
                                                    href: "/1.0.0/document/index.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: true,
                                        badgeCount: 0,
                                    },
                                    {
                                        type: "category",
                                        category: { label: "DOCUMENT" },
                                        path: ["DOCUMENT"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "認証・認可",
                                                    icon: "auth",
                                                    href: "/1.0.0/document/auth.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                            {
                                                type: "category",
                                                category: { label: "DETAIL" },
                                                path: ["DOCUMENT", "DETAIL"],
                                                children: [
                                                    {
                                                        type: "item",
                                                        item: {
                                                            label: "詳細",
                                                            icon: "detail",
                                                            href: "/1.0.0/document/auth.html",
                                                        },
                                                        isActive: false,
                                                        badgeCount: 0,
                                                    },
                                                ],
                                                isExpand: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: false,
                                        badgeCount: 0,
                                    },
                                ],
                            },
                            {
                                type: "succeed-to-load",
                                menu: [
                                    {
                                        type: "category",
                                        category: { label: "MAIN" },
                                        path: ["MAIN"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ホーム",
                                                    icon: "home",
                                                    href: "/1.0.0/index.html",
                                                },
                                                isActive: true,
                                                badgeCount: 10,
                                            },
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ドキュメント",
                                                    icon: "docs",
                                                    href: "/1.0.0/document/index.html",
                                                },
                                                isActive: false,
                                                badgeCount: 20,
                                            },
                                        ],
                                        isExpand: true,
                                        badgeCount: 30,
                                    },
                                    {
                                        type: "category",
                                        category: { label: "DOCUMENT" },
                                        path: ["DOCUMENT"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "認証・認可",
                                                    icon: "auth",
                                                    href: "/1.0.0/document/auth.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                            {
                                                type: "category",
                                                category: { label: "DETAIL" },
                                                path: ["DOCUMENT", "DETAIL"],
                                                children: [
                                                    {
                                                        type: "item",
                                                        item: {
                                                            label: "詳細",
                                                            icon: "detail",
                                                            href: "/1.0.0/document/auth.html",
                                                        },
                                                        isActive: false,
                                                        badgeCount: 0,
                                                    },
                                                ],
                                                isExpand: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: false,
                                        badgeCount: 0,
                                    },
                                ],
                            },
                        ])
                        done()
                        break

                    case "failed-to-load":
                    case "succeed-to-toggle":
                    case "failed-to-toggle":
                        done(new Error(`${state.type}`))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("load menu; saved expands", (done) => {
        const { resource } = expandMenuResource()

        resource.menuList.addStateHandler(stateHandler())

        resource.menuList.load()

        function stateHandler(): Post<MenuListComponentState> {
            const stack: MenuListComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-menu-list":
                    case "succeed-to-instant-load":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-instant-load",
                                menu: [
                                    {
                                        type: "category",
                                        category: { label: "MAIN" },
                                        path: ["MAIN"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ホーム",
                                                    icon: "home",
                                                    href: "/1.0.0/index.html",
                                                },
                                                isActive: true,
                                                badgeCount: 0,
                                            },
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ドキュメント",
                                                    icon: "docs",
                                                    href: "/1.0.0/document/index.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: true,
                                        badgeCount: 0,
                                    },
                                    {
                                        type: "category",
                                        category: { label: "DOCUMENT" },
                                        path: ["DOCUMENT"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "認証・認可",
                                                    icon: "auth",
                                                    href: "/1.0.0/document/auth.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                            {
                                                type: "category",
                                                category: { label: "DETAIL" },
                                                path: ["DOCUMENT", "DETAIL"],
                                                children: [
                                                    {
                                                        type: "item",
                                                        item: {
                                                            label: "詳細",
                                                            icon: "detail",
                                                            href: "/1.0.0/document/auth.html",
                                                        },
                                                        isActive: false,
                                                        badgeCount: 0,
                                                    },
                                                ],
                                                isExpand: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: true,
                                        badgeCount: 0,
                                    },
                                ],
                            },
                            {
                                type: "succeed-to-load",
                                menu: [
                                    {
                                        type: "category",
                                        category: { label: "MAIN" },
                                        path: ["MAIN"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ホーム",
                                                    icon: "home",
                                                    href: "/1.0.0/index.html",
                                                },
                                                isActive: true,
                                                badgeCount: 10,
                                            },
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ドキュメント",
                                                    icon: "docs",
                                                    href: "/1.0.0/document/index.html",
                                                },
                                                isActive: false,
                                                badgeCount: 20,
                                            },
                                        ],
                                        isExpand: true,
                                        badgeCount: 30,
                                    },
                                    {
                                        type: "category",
                                        category: { label: "DOCUMENT" },
                                        path: ["DOCUMENT"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "認証・認可",
                                                    icon: "auth",
                                                    href: "/1.0.0/document/auth.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                            {
                                                type: "category",
                                                category: { label: "DETAIL" },
                                                path: ["DOCUMENT", "DETAIL"],
                                                children: [
                                                    {
                                                        type: "item",
                                                        item: {
                                                            label: "詳細",
                                                            icon: "detail",
                                                            href: "/1.0.0/document/auth.html",
                                                        },
                                                        isActive: false,
                                                        badgeCount: 0,
                                                    },
                                                ],
                                                isExpand: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: true,
                                        badgeCount: 0,
                                    },
                                ],
                            },
                        ])
                        done()
                        break

                    case "failed-to-load":
                    case "succeed-to-toggle":
                    case "failed-to-toggle":
                        done(new Error(`${state.type}`))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })

    test("load menu; toggle expands", (done) => {
        const { repository, resource } = standardMenuResource()

        resource.menuList.addStateHandler(stateHandler())

        resource.menuList.load()

        const toggles = [
            [markMenuCategoryLabel("DOCUMENT")],
            [markMenuCategoryLabel("DOCUMENT"), markMenuCategoryLabel("DETAIL")],
        ]

        function stateHandler(): Post<MenuListComponentState> {
            const stack: MenuListComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-menu-list":
                    case "succeed-to-instant-load":
                        // work in progress...
                        break

                    case "succeed-to-load":
                    case "succeed-to-toggle":
                        toggleOrCheckExpects(state.menu)
                        break

                    case "failed-to-load":
                    case "failed-to-toggle":
                        done(new Error(`${state.type}`))
                        break

                    default:
                        assertNever(state)
                }

                function toggleOrCheckExpects(menu: Menu) {
                    const path = toggles.shift()
                    if (path) {
                        resource.menuList.toggle(menu, path)
                    } else {
                        checkExpects()
                    }
                }
                function checkExpects() {
                    expect(stack).toEqual([
                        {
                            type: "succeed-to-instant-load",
                            menu: [
                                {
                                    type: "category",
                                    category: { label: "MAIN" },
                                    path: ["MAIN"],
                                    children: [
                                        {
                                            type: "item",
                                            item: {
                                                label: "ホーム",
                                                icon: "home",
                                                href: "/1.0.0/index.html",
                                            },
                                            isActive: true,
                                            badgeCount: 0,
                                        },
                                        {
                                            type: "item",
                                            item: {
                                                label: "ドキュメント",
                                                icon: "docs",
                                                href: "/1.0.0/document/index.html",
                                            },
                                            isActive: false,
                                            badgeCount: 0,
                                        },
                                    ],
                                    isExpand: true,
                                    badgeCount: 0,
                                },
                                {
                                    type: "category",
                                    category: { label: "DOCUMENT" },
                                    path: ["DOCUMENT"],
                                    children: [
                                        {
                                            type: "item",
                                            item: {
                                                label: "認証・認可",
                                                icon: "auth",
                                                href: "/1.0.0/document/auth.html",
                                            },
                                            isActive: false,
                                            badgeCount: 0,
                                        },
                                        {
                                            type: "category",
                                            category: { label: "DETAIL" },
                                            path: ["DOCUMENT", "DETAIL"],
                                            children: [
                                                {
                                                    type: "item",
                                                    item: {
                                                        label: "詳細",
                                                        icon: "detail",
                                                        href: "/1.0.0/document/auth.html",
                                                    },
                                                    isActive: false,
                                                    badgeCount: 0,
                                                },
                                            ],
                                            isExpand: false,
                                            badgeCount: 0,
                                        },
                                    ],
                                    isExpand: false,
                                    badgeCount: 0,
                                },
                            ],
                        },
                        {
                            type: "succeed-to-load",
                            menu: [
                                {
                                    type: "category",
                                    category: { label: "MAIN" },
                                    path: ["MAIN"],
                                    children: [
                                        {
                                            type: "item",
                                            item: {
                                                label: "ホーム",
                                                icon: "home",
                                                href: "/1.0.0/index.html",
                                            },
                                            isActive: true,
                                            badgeCount: 10,
                                        },
                                        {
                                            type: "item",
                                            item: {
                                                label: "ドキュメント",
                                                icon: "docs",
                                                href: "/1.0.0/document/index.html",
                                            },
                                            isActive: false,
                                            badgeCount: 20,
                                        },
                                    ],
                                    isExpand: true,
                                    badgeCount: 30,
                                },
                                {
                                    type: "category",
                                    category: { label: "DOCUMENT" },
                                    path: ["DOCUMENT"],
                                    children: [
                                        {
                                            type: "item",
                                            item: {
                                                label: "認証・認可",
                                                icon: "auth",
                                                href: "/1.0.0/document/auth.html",
                                            },
                                            isActive: false,
                                            badgeCount: 0,
                                        },
                                        {
                                            type: "category",
                                            category: { label: "DETAIL" },
                                            path: ["DOCUMENT", "DETAIL"],
                                            children: [
                                                {
                                                    type: "item",
                                                    item: {
                                                        label: "詳細",
                                                        icon: "detail",
                                                        href: "/1.0.0/document/auth.html",
                                                    },
                                                    isActive: false,
                                                    badgeCount: 0,
                                                },
                                            ],
                                            isExpand: false,
                                            badgeCount: 0,
                                        },
                                    ],
                                    isExpand: false,
                                    badgeCount: 0,
                                },
                            ],
                        },
                        {
                            type: "succeed-to-toggle",
                            menu: [
                                {
                                    type: "category",
                                    category: { label: "MAIN" },
                                    path: ["MAIN"],
                                    children: [
                                        {
                                            type: "item",
                                            item: {
                                                label: "ホーム",
                                                icon: "home",
                                                href: "/1.0.0/index.html",
                                            },
                                            isActive: true,
                                            badgeCount: 10,
                                        },
                                        {
                                            type: "item",
                                            item: {
                                                label: "ドキュメント",
                                                icon: "docs",
                                                href: "/1.0.0/document/index.html",
                                            },
                                            isActive: false,
                                            badgeCount: 20,
                                        },
                                    ],
                                    isExpand: true,
                                    badgeCount: 30,
                                },
                                {
                                    type: "category",
                                    category: { label: "DOCUMENT" },
                                    path: ["DOCUMENT"],
                                    children: [
                                        {
                                            type: "item",
                                            item: {
                                                label: "認証・認可",
                                                icon: "auth",
                                                href: "/1.0.0/document/auth.html",
                                            },
                                            isActive: false,
                                            badgeCount: 0,
                                        },
                                        {
                                            type: "category",
                                            category: { label: "DETAIL" },
                                            path: ["DOCUMENT", "DETAIL"],
                                            children: [
                                                {
                                                    type: "item",
                                                    item: {
                                                        label: "詳細",
                                                        icon: "detail",
                                                        href: "/1.0.0/document/auth.html",
                                                    },
                                                    isActive: false,
                                                    badgeCount: 0,
                                                },
                                            ],
                                            isExpand: false,
                                            badgeCount: 0,
                                        },
                                    ],
                                    isExpand: true,
                                    badgeCount: 0,
                                },
                            ],
                        },
                        {
                            type: "succeed-to-toggle",
                            menu: [
                                {
                                    type: "category",
                                    category: { label: "MAIN" },
                                    path: ["MAIN"],
                                    children: [
                                        {
                                            type: "item",
                                            item: {
                                                label: "ホーム",
                                                icon: "home",
                                                href: "/1.0.0/index.html",
                                            },
                                            isActive: true,
                                            badgeCount: 10,
                                        },
                                        {
                                            type: "item",
                                            item: {
                                                label: "ドキュメント",
                                                icon: "docs",
                                                href: "/1.0.0/document/index.html",
                                            },
                                            isActive: false,
                                            badgeCount: 20,
                                        },
                                    ],
                                    isExpand: true,
                                    badgeCount: 30,
                                },
                                {
                                    type: "category",
                                    category: { label: "DOCUMENT" },
                                    path: ["DOCUMENT"],
                                    children: [
                                        {
                                            type: "item",
                                            item: {
                                                label: "認証・認可",
                                                icon: "auth",
                                                href: "/1.0.0/document/auth.html",
                                            },
                                            isActive: false,
                                            badgeCount: 0,
                                        },
                                        {
                                            type: "category",
                                            category: { label: "DETAIL" },
                                            path: ["DOCUMENT", "DETAIL"],
                                            children: [
                                                {
                                                    type: "item",
                                                    item: {
                                                        label: "詳細",
                                                        icon: "detail",
                                                        href: "/1.0.0/document/auth.html",
                                                    },
                                                    isActive: false,
                                                    badgeCount: 0,
                                                },
                                            ],
                                            isExpand: true,
                                            badgeCount: 0,
                                        },
                                    ],
                                    isExpand: true,
                                    badgeCount: 0,
                                },
                            ],
                        },
                    ])
                    expectToSaveExpand(repository, [["MAIN"], ["DOCUMENT"], ["DOCUMENT", "DETAIL"]])
                    done()
                }
            }
        }
    })

    test("load menu; development document", (done) => {
        const { resource } = developmentDocumentMenuResource()

        resource.menuList.addStateHandler(stateHandler())

        resource.menuList.load()

        function stateHandler(): Post<MenuListComponentState> {
            const stack: MenuListComponentState[] = []
            return (state) => {
                stack.push(state)

                switch (state.type) {
                    case "initial-menu-list":
                    case "succeed-to-instant-load":
                        // work in progress...
                        break

                    case "succeed-to-load":
                        expect(stack).toEqual([
                            {
                                type: "succeed-to-instant-load",
                                menu: [
                                    {
                                        type: "category",
                                        category: { label: "MAIN" },
                                        path: ["MAIN"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ホーム",
                                                    icon: "home",
                                                    href: "/1.0.0/index.html",
                                                },
                                                isActive: true,
                                                badgeCount: 0,
                                            },
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ドキュメント",
                                                    icon: "docs",
                                                    href: "/1.0.0/document/index.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: true,
                                        badgeCount: 0,
                                    },
                                    {
                                        type: "category",
                                        category: { label: "DOCUMENT" },
                                        path: ["DOCUMENT"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "認証・認可",
                                                    icon: "auth",
                                                    href: "/1.0.0/document/auth.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                            {
                                                type: "category",
                                                category: { label: "DETAIL" },
                                                path: ["DOCUMENT", "DETAIL"],
                                                children: [
                                                    {
                                                        type: "item",
                                                        item: {
                                                            label: "詳細",
                                                            icon: "detail",
                                                            href: "/1.0.0/document/auth.html",
                                                        },
                                                        isActive: false,
                                                        badgeCount: 0,
                                                    },
                                                ],
                                                isExpand: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: false,
                                        badgeCount: 0,
                                    },
                                    {
                                        type: "category",
                                        category: { label: "DEVELOPMENT" },
                                        path: ["DEVELOPMENT"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "配備構成",
                                                    icon: "deployment",
                                                    href: "/1.0.0/document/development/deployment.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: false,
                                        badgeCount: 0,
                                    },
                                ],
                            },
                            {
                                type: "succeed-to-load",
                                menu: [
                                    {
                                        type: "category",
                                        category: { label: "MAIN" },
                                        path: ["MAIN"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ホーム",
                                                    icon: "home",
                                                    href: "/1.0.0/index.html",
                                                },
                                                isActive: true,
                                                badgeCount: 10,
                                            },
                                            {
                                                type: "item",
                                                item: {
                                                    label: "ドキュメント",
                                                    icon: "docs",
                                                    href: "/1.0.0/document/index.html",
                                                },
                                                isActive: false,
                                                badgeCount: 20,
                                            },
                                        ],
                                        isExpand: true,
                                        badgeCount: 30,
                                    },
                                    {
                                        type: "category",
                                        category: { label: "DOCUMENT" },
                                        path: ["DOCUMENT"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "認証・認可",
                                                    icon: "auth",
                                                    href: "/1.0.0/document/auth.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                            {
                                                type: "category",
                                                category: { label: "DETAIL" },
                                                path: ["DOCUMENT", "DETAIL"],
                                                children: [
                                                    {
                                                        type: "item",
                                                        item: {
                                                            label: "詳細",
                                                            icon: "detail",
                                                            href: "/1.0.0/document/auth.html",
                                                        },
                                                        isActive: false,
                                                        badgeCount: 0,
                                                    },
                                                ],
                                                isExpand: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: false,
                                        badgeCount: 0,
                                    },
                                    {
                                        type: "category",
                                        category: { label: "DEVELOPMENT" },
                                        path: ["DEVELOPMENT"],
                                        children: [
                                            {
                                                type: "item",
                                                item: {
                                                    label: "配備構成",
                                                    icon: "deployment",
                                                    href: "/1.0.0/document/development/deployment.html",
                                                },
                                                isActive: false,
                                                badgeCount: 0,
                                            },
                                        ],
                                        isExpand: false,
                                        badgeCount: 0,
                                    },
                                ],
                            },
                        ])
                        done()
                        break

                    case "failed-to-load":
                    case "succeed-to-toggle":
                    case "failed-to-toggle":
                        done(new Error(`${state.type}`))
                        break

                    default:
                        assertNever(state)
                }
            }
        }
    })
})

function standardMenuResource() {
    const version = standardVersion()
    const url = standardURL()
    const menuTree = standardMenuTree()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const resource = newTestMenuResource(version, url, menuTree, repository, simulator)

    return { repository, resource }
}
function unknownMenuResource() {
    const version = standardVersion()
    const url = unknownURL()
    const menuTree = standardMenuTree()
    const repository = standardRepository()
    const simulator = standardSimulator()
    const resource = newTestMenuResource(version, url, menuTree, repository, simulator)

    return { resource }
}
function developmentDocumentMenuResource() {
    const version = standardVersion()
    const url = standardURL()
    const menuTree = standardMenuTree()
    const repository = developmentDocumentRepository()
    const simulator = standardSimulator()
    const resource = newTestMenuResource(version, url, menuTree, repository, simulator)

    return { resource }
}
function expandMenuResource() {
    const version = standardVersion()
    const url = standardURL()
    const menuTree = standardMenuTree()
    const repository = expandRepository()
    const simulator = standardSimulator()
    const resource = newTestMenuResource(version, url, menuTree, repository, simulator)

    return { resource }
}

function standardVersion(): string {
    return "1.0.0"
}

function standardURL(): URL {
    return new URL("https://example.com/1.0.0/index.html")
}
function unknownURL(): URL {
    return new URL("https://example.com/1.0.0/unknown.html")
}

function standardMenuTree(): MenuTree {
    return [
        {
            type: "category",
            category: { label: "MAIN", permission: { type: "any" } },
            children: [
                { type: "item", item: { label: "ホーム", icon: "home", path: "/index.html" } },
                {
                    type: "item",
                    item: { label: "ドキュメント", icon: "docs", path: "/document/index.html" },
                },
            ],
        },
        {
            type: "category",
            category: { label: "DOCUMENT", permission: { type: "any" } },
            children: [
                { type: "item", item: { label: "認証・認可", icon: "auth", path: "/document/auth.html" } },
                {
                    type: "category",
                    category: { label: "DETAIL", permission: { type: "any" } },
                    children: [
                        {
                            type: "item",
                            item: { label: "詳細", icon: "detail", path: "/document/auth.html" },
                        },
                    ],
                },
            ],
        },
        {
            type: "category",
            category: {
                label: "DEVELOPMENT",
                permission: { type: "role", roles: ["development-document"] },
            },
            children: [
                {
                    type: "item",
                    item: {
                        label: "配備構成",
                        icon: "deployment",
                        path: "/document/development/deployment.html",
                    },
                },
            ],
        },
    ]
}

function standardRepository(): MenuTestRepository {
    return {
        apiCredentials: standardApiCredentialRepository(),
        menuExpands: standardMenuExpandRepository([]),
    }
}
function developmentDocumentRepository(): MenuTestRepository {
    return {
        apiCredentials: developmentDocumentApiCredentialRepository(),
        menuExpands: standardMenuExpandRepository([]),
    }
}
function expandRepository(): MenuTestRepository {
    return {
        apiCredentials: standardApiCredentialRepository(),
        menuExpands: standardMenuExpandRepository([[markMenuCategoryLabel("DOCUMENT")]]),
    }
}

function standardSimulator(): MenuTestRemoteAccess {
    return {
        loadMenuBadge: initLoadMenuBadgeSimulateRemoteAccess(
            () => ({
                success: true,
                value: {
                    "/index.html": 10,
                    "/document/index.html": 20,
                },
            }),
            { wait_millisecond: 0 }
        ),
    }
}

function standardApiCredentialRepository(): ApiCredentialRepository {
    return initApiCredentialRepository({
        apiCredential: initMemoryTypedStorage({
            set: true,
            value: markApiCredential({
                // TODO apiNonce を追加
                //apiNonce: markApiNonce("api-nonce"),
                apiRoles: ["admin"],
            }),
        }),
    })
}
function developmentDocumentApiCredentialRepository(): ApiCredentialRepository {
    return initApiCredentialRepository({
        apiCredential: initMemoryTypedStorage({
            set: true,
            value: markApiCredential({
                // TODO apiNonce を追加
                //apiNonce: markApiNonce("api-nonce"),
                apiRoles: ["admin", "development-document"],
            }),
        }),
    })
}

function standardMenuExpandRepository(menuExpand: MenuExpand): MenuExpandRepository {
    return initMenuExpandRepository({
        menuExpand: initMemoryTypedStorage({ set: true, value: menuExpand }),
    })
}

function expectToSaveExpand(repository: MenuTestRepository, menuExpand: string[][]) {
    expect(repository.menuExpands.findMenuExpand()).toEqual({ success: true, menuExpand })
}

interface Post<T> {
    (state: T): void
}

function assertNever(_: never): never {
    throw new Error("NEVER")
}
