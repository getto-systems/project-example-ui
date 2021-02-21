import { newAuthSignWorker } from "../main/worker/background"

newAuthSignWorker((self as unknown) as Worker)
