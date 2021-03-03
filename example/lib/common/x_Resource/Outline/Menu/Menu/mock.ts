import { lnir, iconClass } from "../../../../../z_external/icon/core"
import { MockAction, MockPropsPasser } from "../../../../../z_vendor/getto-application/action/mock"

import { MenuComponent, MenuComponentState } from "./component"

import {
    markOutlineMenuCategoryLabel_legacy,
    markOutlineMenuItem,
    OutlineMenu,
} from "../../../../../auth/permission/outline/load/data"

export type MenuMockPropsPasser = MockPropsPasser<MenuMockProps>

export type MenuMockProps =
    | Readonly<{ type: "success"; label: string; badgeCount: number }>
    | Readonly<{ type: "fetch-not-found" }>
    | Readonly<{ type: "fetch-failed"; err: string }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function initMockMenuComponent(passer: MenuMockPropsPasser): MenuComponent {
    return new Component(passer)
}

class Component extends MockAction<MenuComponentState> implements MenuComponent {
    readonly initialState: MenuComponentState = { type: "initial-menu" }

    constructor(passer: MenuMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: MenuMockProps): MenuComponentState {
            switch (props.type) {
                case "success":
                    return { type: "succeed-to-load", menu: menu(props.label, props.badgeCount) }

                case "fetch-not-found":
                    return { type: "failed-to-fetch-repository", err: { type: "not-found" } }

                case "fetch-failed":
                    return {
                        type: "failed-to-fetch-repository",
                        err: { type: "infra-error", err: props.err },
                    }

                default:
                    return { type: "failed-to-load", menu: menu("ホーム", 0), err: props }
            }

            function menu(label: string, badgeCount: number): OutlineMenu {
                return [
                    {
                        type: "category",
                        isExpand: true,
                        badgeCount,
                        category: { label: markOutlineMenuCategoryLabel_legacy("MAIN") },
                        path: [markOutlineMenuCategoryLabel_legacy("MAIN")],
                        children: [
                            {
                                type: "item",
                                isActive: true,
                                badgeCount,
                                item: markOutlineMenuItem({
                                    label,
                                    icon: iconClass(lnir("home")),
                                    href: "/dist/index.html",
                                }),
                            },
                        ],
                    },
                ]
            }
        }
    }

    load() {
        // mock では特に何もしない
    }
    toggle() {
        // mock では特に何もしない
    }
}
