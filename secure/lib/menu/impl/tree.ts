import { Icon, iconClass, lnir } from "../../z_external/icon"

import { MenuPermission, MenuTree, MenuTreeNode } from "../infra"

function category(label: string, permission: MenuPermission, children: MenuTree): MenuTreeNode {
    return { type: "category", category: { label, permission }, children }
}
// function allow(role: string): MenuPermission {
//     return { type: "role", role }
// }
const any: MenuPermission = { type: "any" }

function item(label: string, icon: Icon, path: string): MenuTreeNode {
    return { type: "item", item: { label, icon: iconClass(icon), path } }
}

export const tree: MenuTree = [category("MAIN", any, [item("ホーム", lnir("home"), "/index.html")])]
