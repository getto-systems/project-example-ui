import { LocationTypes } from "../../../z_vendor/getto-application/location/infra"

export type SignViewType =
    | "static-privacyPolicy"
    | "password-reset-requestToken"
    | "password-reset-checkStatus"
    | "password-reset"

type SignViewLocationTypes = LocationTypes<SignViewLocationKeys, SignViewType>
export type SignViewLocationDetecter = SignViewLocationTypes["detecter"]
export type SignViewLocationDetectMethod = SignViewLocationTypes["method"]
export type SignViewLocationInfo = SignViewLocationTypes["info"]
export type SignViewLocationKeys = Readonly<{
    static: SignViewSearch<"privacy-policy">
    password: Readonly<{
        reset: SignViewSearch<"request-token" | "check-status" | "reset">
    }>
}>
export type SignViewSearch<N extends string> = Readonly<{
    key: string
    variant: Record<N, true>
}>
