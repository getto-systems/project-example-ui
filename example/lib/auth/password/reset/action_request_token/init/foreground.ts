import { newRequestResetTokenInfra } from "../../request_token/impl/init"

import { buildRequestResetTokenView } from "./worker/foreground"

import { initRequestResetTokenCoreAction, initRequestResetTokenCoreMaterial } from "../core/impl"

import { RequestResetTokenView } from "../resource"

type OutsideFeature = Readonly<{
    webCrypto: Crypto
}>
export function newRequestResetTokenView(feature: OutsideFeature): RequestResetTokenView {
    const { webCrypto } = feature
    return buildRequestResetTokenView(
        initRequestResetTokenCoreAction(
            initRequestResetTokenCoreMaterial(newRequestResetTokenInfra(webCrypto)),
        ),
    )
}
