import { initLoginWorker } from "../../../../auth/x_components/Login/EntryPoint/main/worker/background"

initLoginWorker((self as unknown) as Worker)
