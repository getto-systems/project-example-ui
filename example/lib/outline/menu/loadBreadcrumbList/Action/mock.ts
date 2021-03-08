import { initMockLoadBreadcrumbListCoreAction, standard_MockBreadcrumbList } from "./Core/mock"

import { LoadBreadcrumbListResource } from "./resource"

export function standard_MockLoadBreadcrumbListResource(): LoadBreadcrumbListResource {
    return {
        breadcrumbList: initMockLoadBreadcrumbListCoreAction(standard_MockBreadcrumbList()),
    }
}
