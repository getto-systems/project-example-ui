import { iconClass, lnir } from "../../../z_vendor/icon"
import { MockComponent_legacy } from "../../../sub/getto-example/application/mock"

import { BreadcrumbListComponent, BreadcrumbListComponentState } from "./component"

import { markMenuCategoryLabel, markMenuItem } from "../../permission/menu/data"

export function initMockBreadcrumbListComponent(state: BreadcrumbListComponentState): BreadcrumbListMockComponent {
    return new BreadcrumbListMockComponent(state)
}

export type BreadcrumbMockProps = Readonly<{ type: "success"; label: string; icon: string }>

export function mapBreadcrumbMockProps(props: BreadcrumbMockProps): BreadcrumbListComponentState {
    switch (props.type) {
        case "success":
            return {
                type: "succeed-to-load",
                breadcrumb: [
                    {
                        type: "category",
                        category: { label: markMenuCategoryLabel("MAIN") },
                    },
                    {
                        type: "item",
                        item: markMenuItem({
                            label: props.label,
                            icon: iconClass(lnir(props.icon)),
                            href: "/dist/index.html",
                        }),
                    },
                ],
            }
    }
}

class BreadcrumbListMockComponent
    extends MockComponent_legacy<BreadcrumbListComponentState>
    implements BreadcrumbListComponent {
    load() {
        // mock では特に何もしない
    }
}
