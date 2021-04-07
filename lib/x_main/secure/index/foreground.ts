import { render, h } from "preact"

import { newDashboardView } from "../../../example/action_dashboard/init"

import { DashboardEntry } from "../../../example/action_dashboard/x_preact/dashboard"

render(
    h(
        DashboardEntry,
        newDashboardView({
            webDB: indexedDB,
            webCrypto: crypto,
            currentLocation: location,
        }),
    ),
    document.body,
)
