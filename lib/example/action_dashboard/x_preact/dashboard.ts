import { h, VNode } from "preact"

import {
    appLayout,
    appMain,
    mainBody,
    mainHeader,
    mainTitle,
} from "../../../z_vendor/getto-css/preact/layout/app"

import { useApplicationView } from "../../../z_vendor/getto-application/action/x_preact/hooks"
import { useNotifyUnexpectedError } from "../../../avail/action_notify_unexpected_error/x_preact/hooks"
import { useDocumentTitle } from "../../../x_preact/hooks"

import { copyright, siteInfo } from "../../site"

import { ApplicationErrorComponent } from "../../../avail/common/x_preact/application_error"
import { LoadSeasonEntry } from "../../common/action_load_season/x_preact/load_season"
import { LoadMenuEntry } from "../../../outline/action_load_menu/x_preact/load_menu"
import { LoadBreadcrumbListComponent } from "../../../outline/action_load_breadcrumb_list/x_preact/load_breadcrumb_list"
import { LoadSeasonFieldEntry } from "../../common/action_load_season/x_preact/load_season_field"

import { DashboardView, DashboardResource } from "../resource"
import { box, box_double, container } from "../../../z_vendor/getto-css/preact/design/box"
import { html } from "htm/preact"
import { useEffect, useState } from "preact/hooks"

export function DashboardEntry(view: DashboardView): VNode {
    const resource = useApplicationView(view)

    const err = useNotifyUnexpectedError(resource)
    if (err) {
        return h(ApplicationErrorComponent, { err: `${err}` })
    }

    return h(DashboardComponent, resource)
}

const pageTitle = "ホーム" as const

export function DashboardComponent(resource: DashboardResource): VNode {
    useDocumentTitle(pageTitle)

    return appLayout({
        siteInfo,
        header: [h(LoadSeasonEntry, resource)],
        main: appMain({
            header: mainHeader([mainTitle(pageTitle), h(LoadBreadcrumbListComponent, resource)]),
            body: mainBody(h(ExampleComponent, resource)),
            copyright,
        }),
        menu: h(LoadMenuEntry, resource),
    })
}

function ExampleComponent(resource: DashboardResource): VNode {
    return container([
        box_double({
            title: "GETTO Example",
            body: h(LoadSeasonFieldEntry, resource),
        }),
        box({
            title: "indexed db sample",
            body: h(IndexedDB_sample, {}),
        }),
    ])
}

type EmptyProps = {
    // no props
}
function IndexedDB_sample(_: EmptyProps): VNode {
    const [state, setState] = useState(<IndexedDBState>{ type: "initial-indexed-db" })

    useEffect(() => {
        const db_version = 1 as const
        indexedDB.deleteDatabase("my-database")
        const request = indexedDB.open("my-database", db_version)
        request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            if (!e.target || !(e.target instanceof IDBOpenDBRequest)) {
                return
            }
            const db = e.target.result
            const store = db.createObjectStore("sampleDB", { keyPath: "key" })
            store.transaction.oncomplete = () => {
                const sample = db.transaction("sampleDB", "readwrite").objectStore("sampleDB")
                sample.add({ key: "some-key", value: "some-value" })
            }
        }
        request.onsuccess = (e: Event) => {
            if (!e.target || !(e.target instanceof IDBOpenDBRequest)) {
                return
            }
            const db = e.target.result

            const tx = db.transaction("sampleDB")
            tx.oncomplete = () => db.close()

            const request = tx.objectStore("sampleDB").get("some-key")
            request.onsuccess = (e: Event) => {
                if (!e.target || !(e.target instanceof IDBRequest)) {
                    return
                }
                setState({ type: "succeed-to-get", value: e.target.result.value })
            }
        }
        request.onerror = function (e: Event) {
            setState({ type: "failed-to-open-db", err: `${e.target}` })
        }
    }, [])

    switch (state.type) {
        case "initial-indexed-db":
            return html``

        case "failed-to-open-db":
            return html`DB open error: ${state.err}`

        case "succeed-to-get":
            return html`value: ${state.value}`
    }
}

type IndexedDBState =
    | Readonly<{ type: "initial-indexed-db" }>
    | Readonly<{ type: "failed-to-open-db"; err: string }>
    | Readonly<{ type: "succeed-to-get"; value: string }>
