import { newAuthInitWorker } from "../main/auth"

newAuthInitWorker()((self as unknown) as Worker)
