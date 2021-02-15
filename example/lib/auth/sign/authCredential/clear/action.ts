import { SubmitClearAuthCredentialEvent } from "./event"

export type ClearAuthCredentialAction = Readonly<{
    submit: SubmitClearAuthCredentialMethod
}>

export interface SubmitClearAuthCredentialPod {
    (): SubmitClearAuthCredentialMethod
}
export interface SubmitClearAuthCredentialMethod {
    (post: Post<SubmitClearAuthCredentialEvent>): void
}

interface Post<E> {
    (event: E): void
}
