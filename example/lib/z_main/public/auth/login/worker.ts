import { initLoginWorker } from "../../../../auth/z_EntryPoint/Login/EntryPoint/main/worker/background"

initLoginWorker((self as unknown) as Worker)
