import { newSignWorkerBackground } from "../../../../auth/action_sign/init/worker/background"

newSignWorkerBackground(
    {
        webCrypto: crypto,
    },
    (self as unknown) as Worker,
)
