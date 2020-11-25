import { render, h } from "preact"

import { newDashboardComponentSetFactory } from "../../home/mock"

import { Dashboard } from "../home/dashboard"

render(h(Dashboard, { factory: newDashboardComponentSetFactory() }), document.body)
