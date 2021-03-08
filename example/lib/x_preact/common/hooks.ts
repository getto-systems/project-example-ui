import { useEffect } from "preact/hooks"

export function useTermination_deprecated(terminate: Terminate): void {
    useEffect(() => terminate, [])
}

interface Terminate {
    (): void
}
