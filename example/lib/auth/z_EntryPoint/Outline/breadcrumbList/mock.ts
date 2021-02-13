import { iconClass, lnir } from "../../../../z_vendor/icon"
import { MockComponent, MockPropsPasser } from "../../../../common/getto-example/Application/mock"

import { BreadcrumbListComponent, BreadcrumbListComponentState } from "./component"

import { markMenuCategoryLabel, markMenuItem } from "../../../permission/menu/data"

export type BreadcrumbListMockPropsPasser = MockPropsPasser<BreadcrumbListMockProps>

export type BreadcrumbListMockProps = Readonly<{ type: "success"; label: string; icon: string }>

export function initMockBreadcrumbListComponent(
    passer: BreadcrumbListMockPropsPasser
): BreadcrumbListComponent {
    return new BreadcrumbListMockComponent(passer)
}

class BreadcrumbListMockComponent
    extends MockComponent<BreadcrumbListComponentState>
    implements BreadcrumbListComponent {
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
    }

    load() {
        // mock では特に何もしない
    }
}
