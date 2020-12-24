import { lnir, iconClass } from "../../../../z_external/icon"
import { MockComponent } from "../../../../z_external/mock/component"

import { MenuComponent, MenuState } from "./component"

import { markMenuCategory, markMenuItem, Menu } from "../../menu/data"

export function initMenuComponent(): MenuComponent {
    return new MenuMockComponent(new MenuStateFactory().succeedToLoad())
}
export function initMenu(state: MenuState): MenuMockComponent {
    return new MenuMockComponent(state)
}

export type MenuMockProps =
    | Readonly<{ type: "success"; badgeCount: number }>
    | Readonly<{ type: "empty-nonce" }>
    | Readonly<{ type: "bad-request" }>
    | Readonly<{ type: "server-error" }>
    | Readonly<{ type: "bad-response"; err: string }>
    | Readonly<{ type: "infra-error"; err: string }>

export function mapMenuMockProps(props: MenuMockProps): MenuState {
    switch (props.type) {
        case "success":
            return { type: "succeed-to-load", menu: menu(props.badgeCount) }

        default:
            return { type: "failed-to-load", menu: menu(0), err: props }
    }

    function menu(badgeCount: number): Menu {
        return [
            {
                type: "category",
                isExpand: true,
                badgeCount,
                category: markMenuCategory({ label: "MAIN" }),
                children: [
                    {
                        type: "item",
                        isActive: true,
                        badgeCount,
                        item: markMenuItem({
                            label: "ホーム",
                            icon: iconClass(lnir("home")),
                            href: "/dist/index.html",
                        }),
                    },
                ],
            },
        ]
    }
}

class MenuStateFactory {
    initialMenu(): MenuState {
        return { type: "initial-menu" }
    }
    succeedToLoad(): MenuState {
        return {
            type: "succeed-to-load",
            menu: this.menu(),
        }
    }
    failedToLoad_emptyNonce(): MenuState {
        return {
            type: "failed-to-load",
            menu: this.menu(),
            err: {
                type: "empty-nonce",
            },
        }
    }
    failedToLoad_badRequest(): MenuState {
        return {
            type: "failed-to-load",
            menu: this.menu(),
            err: {
                type: "bad-request",
            },
        }
    }
    failedToLoad_serverError(): MenuState {
        return {
            type: "failed-to-load",
            menu: this.menu(),
            err: {
                type: "server-error",
            },
        }
    }
    failedToLoad_badResponse(): MenuState {
        return {
            type: "failed-to-load",
            menu: this.menu(),
            err: {
                type: "bad-response",
                err: "failed to parse response",
            },
        }
    }
    failedToLoad_infraError(): MenuState {
        return {
            type: "failed-to-load",
            menu: this.menu(),
            err: {
                type: "infra-error",
                err: "failed to access server",
            },
        }
    }

    menu(): Menu {
        const sec = new Date().getSeconds()
        return [
            {
                type: "category",
                isExpand: true,
                badgeCount: sec,
                category: markMenuCategory({ label: "MAIN" }),
                children: [
                    {
                        type: "item",
                        isActive: true,
                        badgeCount: sec,
                        item: markMenuItem({
                            label: "ホーム",
                            icon: iconClass(lnir("home")),
                            href: "/dist/index.html",
                        }),
                    },
                ],
            },
        ]
    }
}

class MenuMockComponent extends MockComponent<MenuState> implements MenuComponent {
    load() {
        // mock では特に何もしない
    }
    toggle() {
        // mock では特に何もしない
    }
}
