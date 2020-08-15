import { auth } from "./auth";
import { config } from "./config";

(async () => {
  //const data = await auth(config.id_server, nonce());
  //setNonce(data.nonce);
  window.GETTO_EXAMPLE_CREDENTIAL = {
    roles: ["admin","development"],
  };

  const path = location.pathname.replace(/.html$/, ".js");

  const script = document.createElement("script");
  script.src = `//${config.secure_server}${path}`;
  document.body.appendChild(script);
})();

function nonce() {
  return window.localStorage.getItem("nonce");
}
function setNonce(nonce) {
  console.log(nonce);
  window.localStorage.setItem("nonce", nonce);
}
