import { render, h } from "preact"

import { newDashboardEntryPoint } from "../../../example/view_dashboard/init"

import { Dashboard } from "../../../example/view_dashboard/x_preact/Dashboard"

render(
    h(
        Dashboard,
        newDashboardEntryPoint({
            webStorage: localStorage,
            currentLocation: location,
        }),
    ),
    document.body,
)
