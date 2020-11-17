import { packMenuCategory, packMenuItem } from "../../menu/adapter"

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

    menu(): Menu {
        return [
            {
                type: "category",
                category: packMenuCategory({
                    isExpand: false,
                    label: "MAIN",
                    badgeCount: 0,
                }),
                children: [
                    {
                        type: "item",
                        item: packMenuItem({
                            isActive: false,
                            href: "/dist/index.html",
                            label: "ホーム",
                            icon: "home",
                            badgeCount: 0,
                        })
                    }
                ]
            }
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

    action() {
        // mock では特に何もしない
    }
}

interface Post<T> {
    (state: T): void
}
