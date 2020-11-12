import { newAuthWorkerBackgroundInitializer } from "../main/auth"

newAuthWorkerBackgroundInitializer()((self as unknown) as Worker)
