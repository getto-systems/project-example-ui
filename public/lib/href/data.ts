import { AuthHref } from "../auth/href"

export type AppHref = Readonly<{
    auth: AuthHref
}>

export interface AppHrefFactory {
    (): AppHref
}
