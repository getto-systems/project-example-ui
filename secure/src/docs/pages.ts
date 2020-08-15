export type CategoryTree = [Category, Array<PageTree>];
export type PageTree = [Page, Array<PageTree>];

export type Category = {
  category: string,
  label: string,
}

export type Page = {
  page: string,
  label: string,
  href: string,
  icon: string,
}

export type Breadcrumbs = [Category, Array<Page>] | null;
type BreadcrumbPages = Array<Page> | null;

export type PageInfo = {
  version: string,
  current: string,
}

export function GettoExamplePages(info: PageInfo): [Array<CategoryTree>, Breadcrumbs] {
  const categories = all(info.version);

  let breadcrumbs: Breadcrumbs = null;

  categories.forEach(([category, subTrees]) => {
    if (breadcrumbs === null) {
      const pages = detect(subTrees);
      if (pages !== null) {
        breadcrumbs = [category, pages];
      }
    }
  });

  return [categories, breadcrumbs];

  function detect(trees: Array<PageTree>): BreadcrumbPages {
    let breadcrumbs: BreadcrumbPages = null;

    trees.forEach(([page, subTrees]) => {
      if (breadcrumbs === null) {
        if (page.href === info.current) {
          breadcrumbs = [page];
        } else {
          const pages = detect(subTrees);
          if (pages !== null) {
            breadcrumbs = [page, ...pages];
          }
        }
      }
    });

    return breadcrumbs;
  }
}

function all(version: string): Array<CategoryTree> {
  const main = `/${version}`;
  const docs = `/${version}/docs`;

  return [
    [ { category: "documents", label: "Documents" }, [
      [ { page: "documents", label: "トップ",         href: `${docs}/index.html`,  icon: "folder-alt" }, [] ],
      [ { page: "main",      label: "メインページへ", href: `${main}/index.html`,  icon: "home" }, [] ],
    ] ],
    [ { category: "server", label: "Server" }, [
      [ { page: "server", label: "サーバー構成", href: `${docs}/server.html`, icon: "file-name" }, [] ],
    ] ],
    [ { category: "detail/server", label: "Server 詳細設計" }, [
      [ { page: "detail/server", label: "サーバー構成", href: `${docs}/detail/server.html`, icon: "list" }, [] ],
    ] ],
    [ { category: "id", label: "ID" }, [
      [ { page: "id", label: "認証・認可", href: `${docs}/id.html`, icon: "file-name" }, [] ],
    ] ],
    [ { category: "detail/id", label: "ID 詳細設計" }, [
      [ { page: "detail/id", label: "認証・認可", href: `${docs}/detail/id.html`, icon: "list" }, [] ],
    ] ],
  ];
}
