import { render, h } from "preact"

import { newDashboardComponentSetFactoryAsSingle } from "../../y_main/home/dashboard"

import { Dashboard } from "../home/dashboard"

render(h(Dashboard, { factory: newDashboardComponentSetFactoryAsSingle() }), document.body)
