import { initAuthWorker } from "../main/auth"

initAuthWorker((self as unknown) as Worker)
