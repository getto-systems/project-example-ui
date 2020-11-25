import { render, h } from "preact"

import { newDashboardComponentSetFactory } from "../../Home/dashboard/mock"

import { Dashboard } from "../home/dashboard"

render(h(Dashboard, { factory: newDashboardComponentSetFactory() }), document.body)
