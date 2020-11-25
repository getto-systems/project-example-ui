import { render, h } from "preact"

import { newDashboardComponentSetFactoryAsSingle } from "../../Home/dashboard/core"

import { Dashboard } from "../home/dashboard"

render(h(Dashboard, { factory: newDashboardComponentSetFactoryAsSingle() }), document.body)
