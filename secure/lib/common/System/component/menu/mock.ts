import { lnir, iconClass } from "../../../../z_external/icon"

import { MenuComponent, MenuState } from "./component"

import { markMenuCategory, markMenuItem, Menu } from "../../../menu/data"

export function newMenuComponent(): MenuComponent {
    return new Component(new MenuStateFactory().succeedToLoad())
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

class Component implements MenuComponent {
    state: MenuState

    constructor(state: MenuState) {
        this.state = state
    }

    onStateChange(post: Post<MenuState>): void {
        post(this.state)
    }

    load() {
        // mock では特に何もしない
    }
    toggle() {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
