import { render, h } from "preact"

import { newDashboardComponentSetFactory } from "../../Home/main/dashboard/mock"

import { Dashboard } from "../home/dashboard"

render(h(Dashboard, { factory: newDashboardComponentSetFactory() }), document.body)
