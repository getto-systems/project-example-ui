import { AppHref } from "../href"

import { ExampleComponent, ExampleParam, ExampleParamPacker } from "./component/example/component"

export interface HomeUsecase {
    href: AppHref
    component: HomeComponent
    onStateChange(stateChanged: Post<HomeState>): void
    init(): HomeUsecaseResource
}
export type HomeUsecaseResource = UsecaseResource<HomeOperation>

export type HomeParam = Readonly<{
    example: ExampleParamPacker
}>

export type HomeBackground = Readonly<{
    //credential: Post<BackgroundCredentialOperation>
}>
export type HomeBackgroundSubscriber = Readonly<{
    //credential: BackgroundCredentialOperationSubscriber
}>

export type HomeComponent = Readonly<{
    example: ExampleComponent
}>

export type HomeState =
    Readonly<{ type: "initial" }> |
    Readonly<{ type: "dashboard", example: ExampleParam }> |
    Readonly<{ type: "error", err: string }>

export const initialHomeState: HomeState = { type: "initial" }

export type HomeOperation =
    Readonly<{ type: "detect" }>

export const initialHomeRequest: Post<HomeOperation> = (): void => {
    throw new Error("Usecase is not initialized. use: `init()`")
}

interface Post<T> {
    (state: T): void
}
interface Terminate {
    (): void
}

type UsecaseResource<T> = Readonly<{
    request: Post<T>
    terminate: Terminate
}>
