import { useState, useEffect } from "preact/hooks"

type Container<T> = Readonly<{ set: false }> | Readonly<{ set: true; components: T }>

export function useComponentSet<T>(factory: ComponentsFactory<T>): Container<T> {
    const [container, setContainer] = useState<Container<T>>({ set: false })
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
