import { useState, useEffect } from "preact/hooks"

type Container<T> = Readonly<{ set: false }> | Readonly<{ set: true; view: T }>

export function useEntryPoint<T>(factory: EntryPointFactory<T>): Container<T> {
    const [container, setContainer] = useState<Container<T>>({ set: false })
    useEffect(() => {
        const { view, terminate } = factory()
        setContainer({ set: true, view })
        return terminate
    }, [])
    return container
}

interface EntryPointFactory<T> {
    (): { view: T; terminate: Terminate }
}
interface Terminate {
    (): void
}
