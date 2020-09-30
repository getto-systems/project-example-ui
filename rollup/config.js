/* eslint-disable */
import { options } from "./options"

const path = require("path");

const entrypoint = [
  { "public/update": path.join(__dirname, "../public/lib/x_update/update.ts") },

  { "public/auth": path.join(__dirname, "../public/lib/x_preact/auth.ts") },
  { "public/auth/password_login": path.join(__dirname, "../public/lib/x_worker/auth/password_login.ts") },
  { "public/auth/password_reset_session": path.join(__dirname, "../public/lib/x_worker/auth/password_reset_session.ts") },
  { "public/auth/password_reset": path.join(__dirname, "../public/lib/x_worker/auth/password_reset.ts") },

  { "secure/home": path.join(__dirname, "../secure/lib/x_preact/home.ts") },
]

export default entrypoint.map((input) => {
  return { input, ...options };
})
