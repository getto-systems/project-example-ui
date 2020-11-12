import { newAuthWorkerInitializer } from "../main/auth"

newAuthWorkerInitializer()((self as unknown) as Worker)
