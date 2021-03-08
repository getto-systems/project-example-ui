import { useEffect, useLayoutEffect, useState } from "preact/hooks"

import { ApplicationEntryPoint, ApplicationStateAction } from "../action"

export function useEntryPoint<R>({ resource, terminate }: ApplicationEntryPoint<R>): R {
    useEffect(() => terminate, [])
    return resource
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
