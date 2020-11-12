import { useState, useEffect } from "preact/hooks"

type ViewContainer<T> = Readonly<{ set: false }> | Readonly<{ set: true; view: T }>

export function useView<T>(factory: ViewFactory<T>): ViewContainer<T> {
    const [container, setContainer] = useState<ViewContainer<T>>({ set: false })
    useEffect(() => {
        const { view, terminate } = factory()
        setContainer({ set: true, view })
        return terminate
    }, [])
    return container
}

type ComponentSetContainer<T> = Readonly<{ set: false }> | Readonly<{ set: true; components: T }>

export function useComponentSet<T>(factory: Factory<T>): ComponentSetContainer<T> {
    const [container, setContainer] = useState<ComponentSetContainer<T>>({ set: false })
    useEffect(() => {
        setContainer({ set: true, components: factory() })
    }, [])
    return container
}

interface ViewFactory<T> {
    (): { view: T; terminate: Terminate }
}
interface Terminate {
    (): void
}
interface Factory<T> {
    (): T
}
