import { auth } from "./auth";
import { config } from "./config";

const path = location.pathname.replace(/.html$/, ".js");

(async () => {
  window.credential = await auth(config.id_server, path);

  const script = document.createElement("script");
  script.src = `//${config.secure_server}${path}`;
  document.body.appendChild(script);
})();
