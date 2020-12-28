import { useEffect } from "preact/hooks";

export function useTerminate(terminate: Terminate): void {
    useEffect(() => terminate, [])
}

interface Terminate {
    (): void
}
