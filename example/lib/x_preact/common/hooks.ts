import { useEffect } from "htm/preact"

export function useTerminate(terminate: Terminate): void {
    useEffect(() => terminate, [])
}

interface Terminate {
    (): void
}
