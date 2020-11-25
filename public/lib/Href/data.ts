import { AuthHref } from "../Auth/href"

export type AppHref = Readonly<{
    auth: AuthHref
}>

export interface AppHrefFactory {
    (): AppHref
}
