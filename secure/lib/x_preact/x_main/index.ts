import { render, h } from "preact"

import { newDashboardAsSingle } from "../../common/Home/dashboard/main/core"

import { Dashboard } from "../common/home/dashboard"

render(
    h(Dashboard, { factory: newDashboardAsSingle(localStorage, location) }),
    document.body
)
