import { packPagePathname } from "../../location/adapter"

import { AppHref } from "../../href"
import {
    HomeUsecase,
    HomeUsecaseResource,
    HomeParam,
    HomeState,
    HomeOperation,
    HomeComponent,
} from "../usecase"

import { BackgroundCredentialComponent } from "../../background/credential/component"

import { PagePathname } from "../../location/data"

type Init = Readonly<{
    currentLocation: Location
    href: AppHref
    param: HomeParam
    component: HomeComponent
    background: Background
}>

export function initHomeUsecase(init: Init): HomeUsecase {
    return new Usecase(init)
}

type Background = Readonly<{
    credential: BackgroundCredentialComponent
}>

class Usecase implements HomeUsecase {
    currentLocation: Location

    href: AppHref
    param: HomeParam
    component: HomeComponent
    background: Background

    listener: Post<HomeState>[] = []

    constructor(init: Init) {
        this.currentLocation = init.currentLocation
        this.href = init.href
        this.param = init.param
        this.component = init.component
        this.background = init.background
    }

    onStateChange(stateChanged: Post<HomeState>): void {
        this.listener.push(stateChanged)
    }

    post(state: HomeState): void {
        this.listener.forEach(post => post(state))
    }

    init(): HomeUsecaseResource {
        return {
            request: operation => this.request(operation),
            terminate: () => { /* component とインターフェイスを合わせるために必要 */ },
        }
    }
    request(_operation: HomeOperation) {
        // TODO location から適切な選択をする
        this.post({
            type: "dashboard",
            breadcrumb: this.param.breadcrumb({
                pagePathname: this.currentPagePathname(),
            }),
            example: this.param.example({
                fetchResponse: this.background.credential.fetch(),
            }),
        })
    }

    currentPagePathname(): PagePathname {
        return packPagePathname(new URL(this.currentLocation.toString()))
    }
}

interface Post<T> {
    (state: T): void
}
