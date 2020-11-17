import { useState, useEffect } from "preact/hooks"

type ComponentSetContainer<T> = Readonly<{ set: false }> | Readonly<{ set: true; components: T }>

export function useComponentSet<T>(factory: ComponentsFactory<T>): ComponentSetContainer<T> {
    const [container, setContainer] = useState<ComponentSetContainer<T>>({ set: false })
    useEffect(() => {
        const { components, terminate } = factory()
        setContainer({ set: true, components })
        return terminate
    }, [])
    return container
}

interface ComponentsFactory<T> {
    (): { components: T; terminate: Terminate }
}
interface Terminate {
    (): void
}
interface Factory<T> {
    (): T
}
