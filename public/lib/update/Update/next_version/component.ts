import { FindAction } from "../../next_version/action"
import { AppTarget, FindError } from "../../next_version/data"

export interface NextVersionComponentFactory {
    (material: NextVersionMaterial): NextVersionComponent
}
export type NextVersionMaterial = Readonly<{
    find: FindAction
}>

export interface NextVersionComponent {
    onStateChange(post: Post<NextVersionState>): void
    find(): void
}

export type NextVersionState =
    | Readonly<{ type: "initial-next-version" }>
    | Readonly<{ type: "failed-to-find"; err: FindError }>
    | Readonly<{ type: "succeed-to-find"; target: AppTarget }>

export const initialPasswordLoginState: NextVersionState = { type: "initial-next-version" }

interface Post<T> {
    (state: T): void
}
