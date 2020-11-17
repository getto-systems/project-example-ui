import { render, h } from "preact"

import { newDashboardComponentSetFactory } from "../../y_mock/home/dashboard"

import { Dashboard } from "../home/dashboard"

render(h(Dashboard, { factory: newDashboardComponentSetFactory() }), document.body)
