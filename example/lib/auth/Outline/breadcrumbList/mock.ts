import { iconClass, lnir } from "../../../z_external/icon"
import { MockComponent } from "../../../z_external/mock/component"

import { BreadcrumbListComponent, BreadcrumbListState } from "./component"

import { markMenuCategoryLabel, markMenuItem } from "../../permission/menu/data"

export function initBreadcrumbListComponent(state: BreadcrumbListState): BreadcrumbListMockComponent {
    return new BreadcrumbListMockComponent(state)
}

export type BreadcrumbMockProps = Readonly<{ type: "success"; label: string; icon: string }>

export function mapBreadcrumbMockProps(props: BreadcrumbMockProps): BreadcrumbListState {
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
    extends MockComponent<BreadcrumbListState>
    implements BreadcrumbListComponent {
    load() {
        // mock では特に何もしない
    }
}
