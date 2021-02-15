import { useEffect, useErrorBoundary, useState } from "preact/hooks"

import { ApplicationComponent } from "../../vendor/getto-example/Application/component"
import { NotifyComponent } from "../../availability/x_Resource/Error/Notify/component"

export function useTermination(terminate: Terminate): void {
    useEffect(() => terminate, [])
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

export function useComponent<S>(component: ApplicationComponent<S>, initial: S): S {
    const [state, setState] = useState(initial)
    useEffect(() => {
        component.addStateHandler(setState)
        return () => {
            component.removeStateHandler(setState)
        }
    }, [])
    return state
}
