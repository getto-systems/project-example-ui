import { menuExpandRepositoryConverter } from "../../kernel/impl/convert"

import { MenuExpand } from "../../kernel/infra"
import { ToggleMenuExpandInfra } from "../infra"

import { ToggleMenuExpandMethod } from "../method"

import { ToggleMenuExpandEvent } from "../event"

import { Menu, MenuCategoryLabel, MenuCategoryPath } from "../../kernel/data"

interface Toggle {
    (infra: ToggleMenuExpandInfra): ToggleMenuExpandMethod
}
export const toggleMenuExpand: Toggle = (infra) => (menu, path, post) => {
    const menuExpands = infra.menuExpand(menuExpandRepositoryConverter)

    const updatedMenu = toggleMenu(menu, path)

    const response = menuExpands.set(gatherMenuExpand(updatedMenu, []))
    if (!response.success) {
        post({ type: "repository-error", menu: updatedMenu, err: response.err })
        return
    }

    post({ type: "succeed-to-toggle", menu: updatedMenu })

    function gatherMenuExpand(target: Menu, path: MenuCategoryPath): MenuExpand {
        const expand: MenuExpand = []
        target.forEach((node) => {
            switch (node.type) {
                case "item":
                    break

                case "category":
                    if (node.isExpand) {
                        gatherCategory(node.category.label, node.children)
                    }
                    break
            }
        })
        return expand

        function gatherCategory(label: MenuCategoryLabel, children: Menu) {
            const currentPath = [...path, label]
            expand.push(currentPath)
            gatherMenuExpand(children, currentPath).forEach((entry) => {
                expand.push(entry)
            })
        }
    }
    function toggleMenu(menu: Menu, path: MenuCategoryPath): Menu {
        if (path.length === 0) {
            return menu
        }
        return menu.map((node) => {
            if (node.type !== "category" || node.category.label !== path[0]) {
                return node
            }
            if (path.length === 1) {
                return { ...node, isExpand: !node.isExpand }
            }
            return {
                ...node,
                children: toggleMenu(node.children, path.slice(1)),
            }
        })
    }
}

export function toggleMenuExpandEventHasDone(_event: ToggleMenuExpandEvent): boolean {
    return true
}
