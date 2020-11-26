import { render, h } from "preact"

import { newDashboardAsSingle } from "../../Home/dashboard/main/core"

import { Dashboard } from "../home/dashboard"

render(
    h(Dashboard, { factory: newDashboardAsSingle(localStorage, location) }),
    document.body
)
