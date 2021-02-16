import { useEffect, useErrorBoundary, useState } from "preact/hooks"

import { ApplicationAction } from "../../common/vendor/getto-example/Application/action"
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

export function useAction<S>(
    action: ApplicationAction<S>,
    initial: S
): S {
    const [state, setState] = useState(initial)
    useEffect(() => {
        action.addStateHandler(setState)
        return () => {
            action.removeStateHandler(setState)
        }
    }, [])
    return state
}
