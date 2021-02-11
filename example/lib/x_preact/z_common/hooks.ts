import { useEffect, useState } from "preact/hooks"

import { ApplicationComponent } from "../../sub/getto-example/x_components/Application/component"

export function useTermination(terminate: Terminate): void {
    useEffect(() => terminate, [])
}

interface Terminate {
    (): void
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
