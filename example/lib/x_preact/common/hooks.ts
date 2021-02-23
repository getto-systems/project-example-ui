import { useEffect, useErrorBoundary, useLayoutEffect, useState } from "preact/hooks"

import { ApplicationStateAction } from "../../z_getto/application/action"
import { NotifyComponent } from "../../availability/x_Resource/Error/Notify/component"

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

export function useErrorNotify(notify: NotifyComponent): unknown {
    const [err] = useErrorBoundary((err) => notify.send(err))
    return err
}

export function useDocumentTitle(title: string): void {
    useEffect(() => {
        document.title = `${title} | ${document.title}`
    }, [])
}

export function useApplicationAction<S>(action: ApplicationStateAction<S>, initial: S): S {
    const [state, setState] = useState(initial)
    useLayoutEffect(() => {
        const ignition = action.ignition()
        ignition.addStateHandler(setState)
        ignition.ignite()
        return () => {
            ignition.removeStateHandler(setState)
        }
    }, [])
    return state
}
