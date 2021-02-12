import { initLoginWorker } from "../../../../auth/z_EntryPoint/Login/main/worker/background"

initLoginWorker((self as unknown) as Worker)
