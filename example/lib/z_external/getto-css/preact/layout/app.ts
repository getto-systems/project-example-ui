import { VNode } from "preact"
import { html } from "htm/preact"

import { VNodeContent } from "../common"
import { SiteInfo } from "../../site"

export type MainLayoutContent = Readonly<{
    header: VNodeContent
    body: VNodeContent
}>

export function appLayout({ main, menu }: { main: VNodeContent; menu: VNodeContent }): VNode {
    return html`<main class="layout__app">${appContainer([main])} ${menu}</main>`
}

export function appLayout_sidebar({
    main,
    sidebar,
    menu,
}: {
    main: VNodeContent
    sidebar: VNodeContent
    menu: VNodeContent
}): VNode {
    return html`<main class="layout__app layout__app__sidebar_single">
        ${appContainer([main, sidebar])} ${menu}
    </main>`
}

export function appLayout_sidebar_double({
    main,
    sidebar,
    menu,
}: {
    main: VNodeContent
    sidebar: VNodeContent
    menu: VNodeContent
}): VNode {
    return html`<main class="layout__app layout__app__sidebar_double">
        ${appContainer([main, sidebar])} ${menu}
    </main>`
}

function appContainer(content: VNodeContent[]): VNode {
    return html`<section class="layout__app__container">${content}</section>`
}

export function appMain({ header, body }: MainLayoutContent): VNode {
    return html`<article class="layout__app__main">${header} ${body} ${mainFooter()}</article>`
}
export function appSidebar({ header, body }: MainLayoutContent): VNode {
    return html`<aside class="layout__app__sidebar">
        <section class="sidebar">${header} ${body} ${mainFooter()}</section>
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

export function sidebarLargeElement(content: VNodeContent): VNode {
    return html`<section class="layout__app__sidebar__largeElement">${content}</section>`
}

export function mainFooter(): VNode {
    return html`<footer class="main__footer">
        <p class="main__footer__message">GETTO.systems</p>
    </footer>`
}

export function menuHeader({ brand, title, subTitle }: SiteInfo): VNode {
    return html`<header class="menu__header">
        <cite class="menu__brand">${brand}</cite>
        <strong class="menu__title">${title}</strong>
        <cite class="menu__subTitle">${subTitle}</cite>
    </header>`
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
    toggle: Handler<Event>
    badge: VNodeContent
    children: VNodeContent
}>
export function menuCategory({ isExpand, label, toggle, badge, children }: MenuCategoryContent): VNode {
    return html`<details class="menu__nav" open=${isExpand} key=${label}>
        <summary class="menu__nav__summary" onClick=${toggle}>
            <span class="menu__nav__summary__label">${label}</span>
            <span class="menu__nav__summary__badge">${badge}</span>
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

export function menuFooter(): VNode {
    return html`<footer class="menu__footer">
        <p class="menu__footer__message">
            powered by : LineIcons <span class="noWrap">/ みんなの文字</span>
        </p>
    </footer>`
}

export function mainBreadcrumb(content: VNodeContent): VNode {
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
