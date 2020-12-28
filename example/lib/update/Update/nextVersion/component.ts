import { Find } from "../../nextVersion/action"
import { AppTarget, FindError } from "../../nextVersion/data"

export interface NextVersionComponentFactory {
    (material: NextVersionMaterial): NextVersionComponent
}
export type NextVersionMaterial = Readonly<{
    find: Find
}>

export interface NextVersionComponent {
    onStateChange(post: Post<NextVersionState>): void
    find(): void
}

export type NextVersionState =
    | Readonly<{ type: "initial-next-version" }>
    | Readonly<{ type: "delayed-to-find" }>
    | Readonly<{ type: "failed-to-find"; err: FindError }>
    | Readonly<{ type: "succeed-to-find"; upToDate: boolean; target: AppTarget }>

export const initialNextVersionState: NextVersionState = { type: "initial-next-version" }

interface Post<T> {
    (state: T): void
}
