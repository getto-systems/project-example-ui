import { newWorkerBackground } from "../main/worker/background"

newWorkerBackground((self as unknown) as Worker)
