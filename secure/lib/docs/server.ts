import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { config } from "../config.js";
import { GettoExampleCredential } from "../credential.js";
import { GettoExamplePages, Breadcrumbs } from "./pages.ts";
import { setDocumentTitle, Menu, BreadcrumbLinks, Footer } from "./layout.ts";

(() => {
  const [categories, breadcrumbs] = GettoExamplePages({
    current: location.pathname,
    version: config.version,
  });
  const credential = GettoExampleCredential();

  const app = h("main", { class: "layout" }, [
    html`<${Page} breadcrumbs=${breadcrumbs}/>`,
    html`<${Menu} breadcrumbs=${breadcrumbs} categories=${categories} credential=${credential} version=${config.version}/>`,
  ]);
  render(app, document.body);
})();

type Props = {
  breadcrumbs: Breadcrumbs,
}

function Page(props: Props) {
  const [state, _] = useState("STATIC-STATE");

  useEffect(() => {
    setDocumentTitle("サーバー構成");
  }, [state]);

  return html`
    <article class="layout__main">
      <header class="main__header">
        <h1 class="main__title">サーバー構成</h1>
        <${BreadcrumbLinks} breadcrumbs=${props.breadcrumbs}/>
      </header>
      <section class="main__body">
        <section class="container content">
          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">サービスの継続提供のために</h2>
              </header>
              <section class="box__body paragraph">
                <p>ランニングコストの削減</p>
                <p>デプロイコストの削減</p>
                <p>アップグレードコストの削減</p>
                <div class="vertical vertical_medium"></div>
                <p>ランニングコスト: 12,000円/月</p>
              </section>
            </div>
          </section>
          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">ストレスのない使用のために</h2>
              </header>
              <section class="box__body paragraph">
                <p>必要な時に使用可能</p>
                <p>使用中に操作が中断されない</p>
                <div class="vertical vertical_medium"></div>
                <p>業務時間内での停止許容時間: 5分/8h</p>
                <small><p>業務時間外はメンテナンスの連絡後停止可能</p></small>
                <p>レスポンスの最大時間: 1秒</p>
                <small><p>処理自体に時間がかかる場合は完了時に通知を行う</p></small>
              </section>
            </div>
          </section>
        </section>
      </section>
      <${Footer}/>
    </article>
  `;
};
