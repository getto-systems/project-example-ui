import { useState, useEffect } from "preact/hooks"

type ViewContainer<T> = Readonly<{ set: false }> | Readonly<{ set: true; view: T }>

export function useView<T>(init: InitView<T>): ViewContainer<T> {
    const [container, setContainer] = useState<ViewContainer<T>>({ set: false })
    useEffect(() => {
        const { view, terminate } = init()
        setContainer({ set: true, view })
        return terminate
    }, [])
    return container
}

type ComponentSetContainer<T> = Readonly<{ set: false }> | Readonly<{ set: true; components: T }>

export function useComponentSet<T>(init: InitComponents<T>): ComponentSetContainer<T> {
    const [container, setContainer] = useState<ComponentSetContainer<T>>({ set: false })
    useEffect(() => {
        setContainer({ set: true, components: init() })
    }, [])
    return container
}

interface InitView<T> {
    (): { view: T; terminate: Terminate }
}
interface Terminate {
    (): void
}
interface InitComponents<T> {
    (): T
}
