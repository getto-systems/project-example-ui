import { useState } from "preact/hooks";
import { html } from "htm/preact";
import { CategoryTree, Breadcrumbs, Category, PageTree, Page } from "./pages.ts";

export type MenuProps = {
  categories: Array<CategoryTree>,
  breadcrumbs: Breadcrumbs,
  credential: Credential,
  version: string,
}

export type Credential = {
  roles: Array<string>,
}

export type BreadcrumbProps = {
  breadcrumbs: Breadcrumbs,
}

export function setDocumentTitle(title: string) {
  document.title = `${title} | Getto Example`;
}

type State = {
  menus: Array<Menu>,
}

type Menu = {
  label: string,
  isExpand: boolean,
  items: Array<Item>,
}

type Item = {
  icon: string,
  href: string,
  isActive: boolean,
  label: string,
}

export function Menu(props: MenuProps) {
  const activePage: Page | null = (() => {
    if (!props.breadcrumbs) {
      return null;
    }

    const [category, pages] = props.breadcrumbs;
    return pages[0];
  })();

  const [state, setState] = useState<State>({
    menus: props.categories.reduce((acc, tree) => {
      const [category, trees] = tree;

      if (category.category.includes("detail/")) {
        if (!props.credential.roles.includes("development")) {
          return acc;
        }
      }

      acc.push(createMenu(category, trees));
      return acc;
    }, [] as Array<Menu>),
  });

  function createMenu(category: Category, trees: Array<PageTree>): Menu {
    const items = trees.map(createItem);
    const isActiveItemExists = items.some((item) => item.isActive);

    return {
      label: category.label,
      isExpand: isActiveItemExists || !category.category.includes("detail/"),
      items,
    };
  }

  function createItem(tree: PageTree): Item {
    const [page, trees] = tree;

    return {
      icon: `lnir lnir-${page.icon}`,
      href: page.href,
      isActive: (activePage === null ? false : activePage.href === page.href),
      label: page.label,
    };
  }

  function toggleMenu(menu: Menu) {
    return (e: MouseEvent) => {
      e.preventDefault();
      menu.isExpand = !menu.isExpand;
      setState({
        menus: state.menus,
      });
    };
  }

  return html`
    <section class="layout__menu menu">
      <header class="layout__menu__header menu__header">
        <cite class="menu__brand">GETTO</cite>
        <strong class="menu__title">Example</strong>
        <cite class="menu__subTitle">the template of project</cite>
      </header>
      <nav class="menu__body">
        ${state.menus.map(menu)}
      </nav>
      <footer class="menu__footer">
        <p class="menu__footer__message">copyright GETTO.systems</p>
        <p class="menu__footer__message">version: ${props.version}</p>
      </footer>
    </section>
  `;

  function menu(menu: Menu) {
    return html`
      <ul class="menu__nav ${menu.isExpand ? "" : "menu__nav_collapsed"}">
        <li>
          <a href="#" class="menu__nav__header menu__nav__link" onClick="${toggleMenu(menu)}">
            ${menu.label}
            ${" "}
            <span class="menu__nav__handle">
              ${handle(menu)}
            </span>
          </a>
        </li>
        <ul class="menu__nav__items ${menu.isExpand ? "menu__nav__items_expand" : ""}">
          ${menu.items.map(item)}
        </ul>
      </ul>
    `;
  }

  function handle(menu: Menu) {
    if (menu.isExpand) {
      return html`<i class="lnir lnir-chevron-down"></i>`;
    } else {
      return html`<i class="lnir lnir-chevron-left"></i>`;
    }
  }

  function item(item: Item) {
    return html`
      <li class="menu__nav__item">
        <a href="${item.href}" class="menu__nav__link ${item.isActive ? "menu__nav__item_active" : ""}">
          <i class="${item.icon}"></i>
          ${" "}
          ${item.label}
        </a>
      </li>
    `;
  }
}

export function BreadcrumbLinks(props: BreadcrumbProps) {
  if (props.breadcrumbs === null) {
    return html``
  }

  const [category, pages] = props.breadcrumbs;

  return html`
    <p class="main__breadcrumb">
      <a href="#menu">${category.label}</a>
      ${pages.map(link)}
    </p>
  `

  function link(page: Page) {
    return html`
      <span class="main__breadcrumb__separator"><i class="lnir lnir-chevron-right"></i></span>
      <a href="${page.href}"><i class="lnir lnir-${page.icon}"></i> ${page.label}</a>
    `
  }
}

export function Footer() {
  return html`
    <footer class="main__footer">
      <p class="main__footer__message">powered by : LineIcons / みんなの文字</p>
    </footer>
  `
}
