import { initLoginWorker } from "../../../../auth/z_EntryPoint/Sign/main/worker/background"

initLoginWorker((self as unknown) as Worker)
