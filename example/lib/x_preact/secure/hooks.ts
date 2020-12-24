import { useState, useEffect } from "preact/hooks"

type Container<T> = Readonly<{ set: false }> | Readonly<{ set: true; resource: T }>

export function useEntryPoint<T>(factory: EntryPointFactory<T>): Container<T> {
    const [container, setContainer] = useState<Container<T>>({ set: false })
    useEffect(() => {
        const { resource, terminate } = factory()
        setContainer({ set: true, resource })
        return terminate
    }, [])
    return container
}

interface EntryPointFactory<T> {
    (): { resource: T; terminate: Terminate }
}
interface Terminate {
    (): void
}
