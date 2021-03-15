import { render, h } from "preact"

import { newDashboardEntryPoint } from "../../../example/action_dashboard/init"

import { Dashboard } from "../../../example/action_dashboard/x_preact/dashboard"

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
