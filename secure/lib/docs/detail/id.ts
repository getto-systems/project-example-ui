import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { config } from "../../config.js";
import { GettoExampleCredential } from "../../credential.js";
import { GettoExamplePages, Breadcrumbs } from "../pages.ts";
import { setDocumentTitle, Menu, BreadcrumbLinks, Footer } from "../layout.ts";

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
    setDocumentTitle("認証・認可 | 詳細設計");
  }, [state]);

  return html`
    <article class="layout__main">
      <header class="main__header">
        <h1 class="main__title">認証・認可 <small>詳細設計</small></h1>
        <${BreadcrumbLinks} breadcrumbs=${props.breadcrumbs}/>
      </header>
      <article class="main__body">

        <section class="container">

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">継続認証</h2>
              </header>
              <section class="box__body paragraph">
                <p>ApiRoles 登録なしで「権限なし」</p>
                <p>最大延長期間まで延長可能</p>
                <p>有効期限切れで認証エラー</p>
                <p>ログアウト済みで認証エラー</p>
                <p>チケット登録なしで認証エラー</p>
                <p>Nonce 不一致で認証エラー</p>
                <p>ユーザー不一致で認証エラー</p>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">ログアウト</h2>
              </header>
              <section class="box__body paragraph">
                <p>有効期限切れで認証エラー</p>
              </section>
            </div>
          </section>

        </section>

        <div class="vertical vertical_medium"></div>

        <section class="container">

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">パスワードログイン</h2>
              </header>
              <section class="box__body paragraph">
                <p>パスワード登録なしで認証エラー</p>
                <p>パスワード不一致で認証エラー</p>
                <p>空のパスワードで認証エラー</p>
                <p>長いパスワードで認証エラー</p>
                <p>ぎりぎりの長さで認証成功</p>
              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">パスワード変更</h2>
              </header>
              <section class="box__body paragraph">
                <p>変更後は古いパスワードは無効</p>

                <div class="vertical vertical_small"></div>

                <dl class="form">
                  <dt class="form__header">GetLogin</dt>
                  <dd class="form__field">
                    <p>有効期限切れで認証エラー</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">Change</dt>
                  <dd class="form__field">
                    <p>有効期限切れで認証エラー</p>
                    <p>旧パスワード不一致で変更エラー</p>
                    <p>空のパスワードで変更エラー</p>
                    <p>長いパスワードで変更エラー</p>
                    <p>ぎりぎりの長さで変更成功</p>
                  </dd>
                </dl>

              </section>
            </div>
          </section>

          <section class="box">
            <div>
              <header class="box__header">
                <h2 class="box__title">パスワードリセット</h2>
              </header>
              <section class="box__body paragraph">
                <p>変更後は古いパスワードは無効</p>
                <p>変更後はセッションは無効</p>

                <div class="vertical vertical_small"></div>

                <dl class="form">
                  <dt class="form__header">CreateSession</dt>
                  <dd class="form__field">
                    <p>不明なログインIDで生成エラー</p>
                    <p>宛先未登録で生成エラー</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">GetStatus</dt>
                  <dd class="form__field">
                    <p>不明なセッションIDで取得エラー</p>
                    <p>不明なログインIDで取得エラー</p>
                    <p>ログインID不一致で取得エラー</p>
                  </dd>
                </dl>

                <dl class="form">
                  <dt class="form__header">Reset</dt>
                  <dd class="form__field">
                    <p>不明なセッションIDでリセットエラー</p>
                    <p>有効期限切れでリセットエラー</p>
                    <p>有効期限ぎりぎりでリセット成功</p>
                    <p>不明なログインIDでリセットエラー</p>
                    <p>ログインID不一致でリセットエラー</p>
                    <p>不正なパスワードでリセットエラー</p>
                  </dd>
                </dl>

              </section>
            </div>
          </section>

        </section>
      </article>
      <${Footer}/>
    </article>
  `;
};
