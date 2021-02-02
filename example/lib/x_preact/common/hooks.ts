import { useEffect, useState } from "preact/hooks";

import { ApplicationComponent } from "../../sub/getto-example/application/component";

export function useTerminate(terminate: Terminate): void {
    useEffect(() => terminate, [])
}

interface Terminate {
    (): void
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
