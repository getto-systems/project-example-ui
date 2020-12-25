import { iconClass, lnir } from "../../../z_external/icon"
import { MockComponent } from "../../../z_external/mock/component"

import { BreadcrumbListComponent, BreadcrumbListState } from "./component"

import { markMenuCategory, markMenuItem } from "../../shared/menu/data"

export function initBreadcrumb(state: BreadcrumbListState): BreadcrumbMockComponent {
    return new BreadcrumbMockComponent(state)
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
                        category: markMenuCategory({ label: "MAIN" }),
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

class BreadcrumbMockComponent extends MockComponent<BreadcrumbListState> implements BreadcrumbListComponent {
    load() {
        // mock では特に何もしない
    }
}
