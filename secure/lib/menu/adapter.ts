import { Icon } from "../z_external/icon"

import { MenuLabel, MenuIcon, MenuHref, MenuBadgeCount } from "./data"

export function packMenuLabel(label: string): MenuLabel {
    return label as MenuLabel & string
}

export function unpackMenuLabel(label: MenuLabel): string {
    return (label as unknown) as string
}

export function packMenuIcon(icon: Icon): MenuIcon {
    return icon as MenuIcon & Icon
}

export function unpackMenuIcon(icon: MenuIcon): Icon {
    return (icon as unknown) as Icon
}

export function packMenuHref(href: string): MenuHref {
    return href as MenuHref & string
}

export function unpackMenuHref(icon: MenuHref): string {
    return (icon as unknown) as string
}

export function packMenuBadgeCount(badgeCount: number): MenuBadgeCount {
    return badgeCount as MenuBadgeCount & number
}

export function unpackMenuBadgeCount(badgeCount: MenuBadgeCount): number {
    return (badgeCount as unknown) as number
}
