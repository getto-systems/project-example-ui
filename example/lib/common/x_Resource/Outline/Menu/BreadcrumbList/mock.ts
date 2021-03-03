import { iconClass, lnir } from "../../../../../z_external/icon/core"
import { MockAction, MockPropsPasser } from "../../../../../z_vendor/getto-application/action/mock"

import { BreadcrumbListComponent, BreadcrumbListComponentState } from "./component"

import {
    markOutlineMenuCategoryLabel_legacy,
    markOutlineMenuItem,
} from "../../../../../auth/permission/outline/load/data"

export type BreadcrumbListMockPropsPasser = MockPropsPasser<BreadcrumbListMockProps>

export type BreadcrumbListMockProps = Readonly<{ type: "success"; label: string; icon: string }>

export function initMockBreadcrumbListComponent(
    passer: BreadcrumbListMockPropsPasser,
): BreadcrumbListComponent {
    return new Component(passer)
}

class Component
    extends MockAction<BreadcrumbListComponentState>
    implements BreadcrumbListComponent {
    readonly initialState: BreadcrumbListComponentState = { type: "initial-breadcrumb-list" }

    constructor(passer: BreadcrumbListMockPropsPasser) {
        super()
        passer.addPropsHandler((props) => {
            this.post(mapProps(props))
        })

        function mapProps(props: BreadcrumbListMockProps): BreadcrumbListComponentState {
            switch (props.type) {
                case "success":
                    return {
                        type: "succeed-to-load",
                        breadcrumb: [
                            {
                                type: "category",
                                category: { label: markOutlineMenuCategoryLabel_legacy("MAIN") },
                            },
                            {
                                type: "item",
                                item: markOutlineMenuItem({
                                    label: props.label,
                                    icon: iconClass(lnir(props.icon)),
                                    href: "/dist/index.html",
                                }),
                            },
                        ],
                    }
            }
        }
    }

    load() {
        // mock では特に何もしない
    }
}
