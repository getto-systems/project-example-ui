import { useEffect, useState } from "preact/hooks";

export function useTerminate(terminate: Terminate): void {
    useEffect(() => terminate, [])
}

interface Terminate {
    (): void
}

export function useComponent<S>(component: Component<S>, initial: S): S {
    const [state, setState] = useState(initial)
    useEffect(() => {
        component.onStateChange(setState)
    }, [])

    return state
}

interface Component<S> {
    onStateChange(listener: Listener<S>): void
}
interface Listener<S> {
    (state: S): void
}
