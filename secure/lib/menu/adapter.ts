import { Icon } from "../z_external/icon"

import { MenuLabel, MenuIcon, MenuHref, MenuBadgeCount, MenuPath, MenuVersion } from "./data"

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

export function unpackMenuHref(href: MenuHref): string {
    return (href as unknown) as string
}

export function packMenuBadgeCount(badgeCount: number): MenuBadgeCount {
    return badgeCount as MenuBadgeCount & number
}

export function unpackMenuBadgeCount(badgeCount: MenuBadgeCount): number {
    return (badgeCount as unknown) as number
}

export function packMenuVersion(version: string): MenuVersion {
    return version as MenuVersion & string
}

export function unpackMenuVersion(version: MenuVersion): string {
    return (version as unknown) as string
}

export function packMenuPath(path: string): MenuPath {
    return path as MenuPath & string
}

export function unpackMenuPath(path: MenuPath): string {
    return (path as unknown) as string
}
