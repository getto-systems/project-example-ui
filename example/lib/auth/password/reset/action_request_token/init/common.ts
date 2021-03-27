import { newRequestResetTokenInfra } from "../../request_token/impl/init"

import { initRequestResetTokenCoreMaterial } from "../core/impl"

import { RequestResetTokenCoreMaterial } from "../core/action"

export function newRequestResetTokenCoreMaterial(webCrypto: Crypto): RequestResetTokenCoreMaterial {
    return initRequestResetTokenCoreMaterial(newRequestResetTokenInfra(webCrypto))
}
