import { ApiError } from "../../data"

export type Authn = Readonly<{ nonce: string }>
export type Authz = Readonly<{ nonce: string; roles: string[] }>

export type AuthResponse = Readonly<{
    authn: Authn
    authz: Authz
}>

export type AuthError =
    | ApiError
    | Readonly<{ type: "invalid-ticket" }>
    | Readonly<{ type: "bad-request" }>

export type ParseErrorResult =
    | Readonly<{ success: true; message: string }>
    | Readonly<{ success: false; err: string }>
