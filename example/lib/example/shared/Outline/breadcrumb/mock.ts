import { iconClass, lnir } from "../../../../z_external/icon"
import { MockComponent } from "../../../../z_external/mock/component"

import { BreadcrumbComponent, BreadcrumbState } from "./component"

import { markMenuCategory, markMenuItem } from "../../menu/data"

export function initBreadcrumb(state: BreadcrumbState): BreadcrumbMockComponent {
    return new BreadcrumbMockComponent(state)
}

export type BreadcrumbMockProps = Readonly<{ type: "success"; label: string; icon: string }>

export function mapBreadcrumbMockProps(props: BreadcrumbMockProps): BreadcrumbState {
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

class BreadcrumbMockComponent extends MockComponent<BreadcrumbState> implements BreadcrumbComponent {
    load() {
        // mock では特に何もしない
    }
}
