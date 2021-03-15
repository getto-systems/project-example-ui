import { initMockLoadBreadcrumbListCoreAction, standard_MockBreadcrumbList } from "./core/mock"

import { LoadBreadcrumbListResource } from "./resource"

export function mockLoadBreadcrumbListResource(): LoadBreadcrumbListResource {
    return {
        breadcrumbList: initMockLoadBreadcrumbListCoreAction(standard_MockBreadcrumbList()),
    }
}
