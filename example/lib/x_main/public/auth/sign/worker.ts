import { newLoginWorker } from "../../../../auth/z_EntryPoint/Sign/main/worker/background"

newLoginWorker((self as unknown) as Worker)
