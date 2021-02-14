import { lnir, iconClass } from "../../../../../z_vendor/icon"
import { MockComponent, MockPropsPasser } from "../../../../../vendor/getto-example/Application/mock"

import { MenuComponent, MenuComponentState } from "./component"

import { markMenuCategoryLabel, markMenuItem, Menu } from "../../../../../auth/permission/menu/data"

export type MenuMockPropsPasser = MockPropsPasser<MenuMockProps>

export type MenuMockProps =
    | Readonly<{ type: "success"; label: string; badgeCount: number }>
    | Readonly<{ type: "empty-nonce" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function initMockMenuComponent(passer: MenuMockPropsPasser): MenuComponent {
    return new Component(passer)
}

class Component extends MockComponent<MenuComponentState> implements MenuComponent {
    constructor(passer: MenuMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))            
        })

        function mapProps(props: MenuMockProps): MenuComponentState {
            switch (props.type) {
                case "success":
                    return { type: "succeed-to-load", menu: menu(props.label, props.badgeCount) }

                default:
                    return { type: "failed-to-load", menu: menu("ホーム", 0), err: props }
            }

            function menu(label: string, badgeCount: number): Menu {
                return [
                    {
                        type: "category",
                        isExpand: true,
                        badgeCount,
                        category: { label: markMenuCategoryLabel("MAIN") },
                        path: [markMenuCategoryLabel("MAIN")],
                        children: [
                            {
                                type: "item",
                                isActive: true,
                                badgeCount,
                                item: markMenuItem({
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
