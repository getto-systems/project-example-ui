import { newLoginWorker } from "../main/worker/background"

newLoginWorker((self as unknown) as Worker)
