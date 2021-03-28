import { VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent } from "../common"
import { SiteInfo } from "../../site"

export type AppLayoutContent = Readonly<{
    siteInfo: SiteInfo
    header: VNodeContent[]
    main: VNodeContent
    menu: VNodeContent
}>

export function appLayout({ siteInfo, header, main, menu }: AppLayoutContent): VNode {
    return layoutContent("normal", siteInfo, header, [appBodyContainer([main]), menu])
}

export type AppLayoutSidebarContent = AppLayoutContent &
    Readonly<{
        sidebar: VNodeContent
    }>

export function appLayout_sidebar({
    siteInfo,
    header,
    main,
    sidebar,
    menu,
}: AppLayoutSidebarContent): VNode {
    return layoutContent("sidebar_single", siteInfo, header, [
        appBodyContainer([main, sidebar]),
        menu,
    ])
}

export function appLayout_sidebar_double({
    siteInfo,
    header,
    main,
    sidebar,
    menu,
}: AppLayoutSidebarContent): VNode {
    return layoutContent("sidebar_double", siteInfo, header, [
        appBodyContainer([main, sidebar]),
        menu,
    ])
}

type AppLayoutType = "normal" | "sidebar_single" | "sidebar_double"
function toAppLayoutClass(type: AppLayoutType): string {
    switch (type) {
        case "normal":
            return ""

        case "sidebar_single":
        case "sidebar_double":
            return `layout__app__${type}`
    }
}

function layoutContent(
    type: AppLayoutType,
    siteInfo: SiteInfo,
    header: VNodeContent[],
    content: VNodeContent[],
) {
    return html`<main class="layout__app ${toAppLayoutClass(type)}">
        ${appHeader(siteInfo, header)}
        <section class="layout__app__body">${content}</section>
    </main>`
}

function appHeader({ brand, title, subTitle }: SiteInfo, header: VNodeContent[]): VNode {
    return html`<header class="app__header">${logo()} ${header.map(box)}</header>`

    function logo() {
        return html`<aside class="app__logo">
            <cite class="app__logo__brand">${brand}</cite>
            <strong class="app__logo__title">${title}</strong>
            <cite class="app__logo__subTitle">${subTitle}</cite>
        </aside>`
    }
    function box(content: VNodeContent) {
        return html`<section class="app__header__box">${content}</section>`
    }
}
function appBodyContainer(content: VNodeContent[]): VNode {
    return html`<section class="layout__app__body__container">${content}</section>`
}

export type MainLayoutContent = Readonly<{
    header: VNodeContent
    body: VNodeContent
    copyright: VNodeContent
}>
export function appMain({ header, body, copyright }: MainLayoutContent): VNode {
    return html`<article class="layout__app__main">
        ${header} ${body} ${mainFooter(copyright)}
    </article>`
}
export function appSidebar({ header, body, copyright }: MainLayoutContent): VNode {
    return html`<aside class="layout__app__sidebar">
        <section class="sidebar">${header} ${body} ${mainFooter(copyright)}</section>
    </aside>`
}
export function appMenu(content: VNodeContent): VNode {
    return html`<aside class="layout__app__menu">
        <section class="menu">${content}</section>
    </aside>`
}

export function mainHeader(content: VNodeContent): VNode {
    return html`<header class="main__header">${content}</header>`
}

export function mainTitle(content: VNodeContent): VNode {
    return html`<h1 class="main__title">${content}</h1>`
}

export function mainBody(content: VNodeContent): VNode {
    return html`<section class="main__body">${content}</section>`
}

export function sidebarBody(content: VNodeContent): VNode {
    return html`<section class="sidebar__body">${content}</section>`
}
export function sidebarBody_grow(content: VNodeContent): VNode {
    return html`<section class="sidebar__body sidebar__body_grow">${content}</section>`
}

export function mainFooter(copyright: VNodeContent): VNode {
    return html`<footer class="main__footer">
        <p class="main__footer__message">${copyright}</p>
    </footer>`
}

export function menuBox(content: VNodeContent): VNode {
    return html`<section class="menu__box">${content}</section>`
}

export function menuBody(id: string, content: VNodeContent): VNode {
    return html`<nav id=${id} class="menu__body">${content}</nav>`
}

export type MenuCategoryContent = Readonly<{
    isExpand: boolean
    label: string
    show: Handler<Event>
    hide: Handler<Event>
    badge: VNodeContent
    children: VNodeContent
}>
export function menuCategory({
    isExpand,
    label,
    show,
    hide,
    badge,
    children,
}: MenuCategoryContent): VNode {
    return html`<details class="menu__nav" open=${isExpand} key=${label}>
        <summary class="menu__nav__summary" onClick=${isExpand ? hide : show}>
            <span class="menu__nav__summary__container">
                <span class="menu__nav__summary__label">${label}</span>
                <span class="menu__nav__summary__badge">${badge}</span>
            </span>
        </summary>
        <ul class="menu__nav__items">
            ${children}
        </ul>
    </details>`
}

export type MenuItemContent = Readonly<{
    isActive: boolean
    href: string
    content: VNodeContent
    badge: VNodeContent
}>
export function menuItem({ isActive, href, content, badge }: MenuItemContent): VNode {
    const activeClass = isActive ? "menu__nav__item_active" : ""

    return html`<li class="menu__nav__item" key=${href}>
        <a class="menu__nav__link ${activeClass}" href=${href}>
            <span class="menu__nav__item__label">${content}</span>
            <span class="menu__nav__item__badge">${badge}</span>
        </a>
    </li>`
}

export function menuFooter(poweredBy: readonly string[]): VNode {
    return html`<footer class="menu__footer">
        <p class="menu__footer__message">
            powered by :<br />
            <span class="noWrap">${poweredBy.join(" / ")}</span>
        </p>
    </footer>`
}

export function mainBreadcrumbList(content: VNodeContent): VNode {
    return html`<aside class="main__breadcrumb">${content}</aside>`
}
export function mainBreadcrumbLink(href: string, content: VNodeContent): VNode {
    return html`<a class="main__breadcrumb__item" href="${href}">${content}</a>`
}
export function mainBreadcrumbSeparator(content: VNodeContent): VNode {
    return html`<span class="main__breadcrumb__separator">${content}</span>`
}

interface Handler<T> {
    (event: T): void
}
