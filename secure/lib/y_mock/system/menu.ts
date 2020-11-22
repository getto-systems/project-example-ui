import { lnir } from "../../z_external/icon"

import { packMenuLabel, packMenuIcon, packMenuHref, packMenuBadgeCount } from "../../menu/adapter"

import { MenuComponent, MenuState } from "../../system/component/menu/component"

import { Menu } from "../../menu/data"

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
        return [
            {
                type: "category",
                category: {
                    isExpand: true,
                    label: packMenuLabel("MAIN"),
                    badgeCount: packMenuBadgeCount(10),
                },
                children: [
                    {
                        type: "item",
                        item: {
                            isActive: true,
                            href: packMenuHref("/dist/index.html"),
                            label: packMenuLabel("ホーム"),
                            icon: packMenuIcon(lnir("home")),
                            badgeCount: packMenuBadgeCount(10),
                        },
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
}

interface Post<T> {
    (state: T): void
}
