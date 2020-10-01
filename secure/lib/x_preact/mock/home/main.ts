import { newAppHref } from "../../../main/href"

import { newExampleComponent } from "./example"

import { packExampleParam } from "../../../home/component/example/impl"

import { packApiRoles } from "../../../credential/adapter"

import { AppHref } from "../../../href"
import { HomeUsecase, HomeUsecaseResource, HomeComponent, HomeState } from "../../../home/usecase"

export function newHomeUsecase(): HomeUsecase {
    return new Usecase(new Init().dashboard())
}

class Init {
    dashboard(): HomeState {
        const apiCredential = {
            apiRoles: packApiRoles(["admin", "dev"]),
        }

        return {
            type: "dashboard",
            example: packExampleParam({ apiCredential })
        }
    }
}

class Usecase implements HomeUsecase {
    href: AppHref
    component: HomeComponent

    state: HomeState

    constructor(state: HomeState) {
        this.href = newAppHref()
        this.component = {
            example: newExampleComponent(),
        }

        this.state = state
    }

    onStateChange(stateChanged: Post<HomeState>): void {
        stateChanged(this.state)
    }

    init(): HomeUsecaseResource {
        return {
            request: () => { /* mock では特に何もしない */ },
            terminate: () => { /* mock では特に何もしない */ },
        }
    }
}

interface Post<T> {
    (state: T): void
}
