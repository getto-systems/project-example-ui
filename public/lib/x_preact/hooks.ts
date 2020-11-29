import { useState, useEffect } from "preact/hooks"

type Container<T> = Readonly<{ set: false }> | Readonly<{ set: true; view: T }>

export function useView<T>(factory: ViewFactory<T>): Container<T> {
    const [container, setContainer] = useState<Container<T>>({ set: false })
    useEffect(() => {
        const { view, terminate } = factory()
        setContainer({ set: true, view })
        return terminate
    }, [])
    return container
}

interface ViewFactory<T> {
    (): { view: T; terminate: Terminate }
}
interface Terminate {
    (): void
}
