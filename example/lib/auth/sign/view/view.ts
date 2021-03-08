import { LocationTypes } from "../../../z_vendor/getto-application/location/infra"

export type SignViewType =
    | "password-reset-requestToken"
    | "password-reset-checkStatus"
    | "password-reset"

type SignViewLocationTypes = LocationTypes<SignViewLocationKeys, SignViewType>
export type SignViewLocationDetecter = SignViewLocationTypes["detecter"]
export type SignViewLocationDetectMethod = SignViewLocationTypes["method"]
export type SignViewLocationInfo = SignViewLocationTypes["info"]
export type SignViewLocationKeys = Readonly<{
    password: Readonly<{
        reset: Readonly<{
            key: string
            variant: Record<"requestToken" | "checkStatus" | "reset", true>
        }>
    }>
}>
export type SignViewSearch<N extends string> = Readonly<{
    key: string
    variant: Record<N, true>
}>
