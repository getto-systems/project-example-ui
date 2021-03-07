import { useEffect, useLayoutEffect, useState } from "preact/hooks"

import { ApplicationStateAction } from "../../z_vendor/getto-application/action/action"

export function useEntryPoint<R>({ resource, terminate }: EntryPoint<R>): R {
    useTermination_deprecated(terminate)
    return resource
}
export function useTermination_deprecated(terminate: Terminate): void {
    useEffect(() => terminate, [])
}

interface EntryPoint<R> {
    resource: R
    terminate: Terminate
}
interface Terminate {
    (): void
}

export function useDocumentTitle(title: string): void {
    useEffect(() => {
        document.title = `${title} | ${document.title}`
    }, [])
}

export function useApplicationAction<S>(action: ApplicationStateAction<S>): S {
    const [state, setState] = useState(action.initialState)
    useLayoutEffect(() => {
        action.subscriber.subscribe(setState)
        action.ignite()
        return () => {
            action.subscriber.unsubscribe(setState)
        }
    }, [])
    return state
}
