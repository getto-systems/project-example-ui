import { useState } from "preact/hooks"

type ViewContainer<T> = Readonly<{ set: false }> | Readonly<{ set: true; view: T }>

export function useView<T>(): [ViewContainer<T>, Setup<T>] {
    const [container, setContainer] = useState<ViewContainer<T>>({ set: false })
    const setView = (view: T) => {
        setContainer({ set: true, view })
    }
    return [container, setView]
}

type ComponentSetContainer<T> = Readonly<{ set: false }> | Readonly<{ set: true; components: T }>

export function useComponentSet<T>(): [ComponentSetContainer<T>, Setup<T>] {
    const [container, setContainer] = useState<ComponentSetContainer<T>>({ set: false })
    const setComponents = (components: T) => {
        setContainer({ set: true, components })
    }
    return [container, setComponents]
}

interface Setup<T> {
    (view: T): void
}
