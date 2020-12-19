import { initLoginWorker } from "../../../auth/Auth/Login/main/worker/background"

initLoginWorker((self as unknown) as Worker)
