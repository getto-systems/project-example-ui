export interface ApiAvailableCheck {
    (url: SendURL): Promise<RawCheckResult>
}

type SendURL = string

type RawCheckResult =
    | Readonly<{ success: false; err: RawError }>
    | Readonly<{ success: true; value: boolean }>

type RawError = Readonly<{ type: string; err: string }>

export function initApiAvailableCheck(): ApiAvailableCheck {
    return async (url: SendURL): Promise<RawCheckResult> => {
        const response = await fetch(url, { method: "HEAD" })
        if (!response.ok) {
            if (response.status >= 500) {
                return { success: false, err: { type: "server-error", err: "" } }
            }
            return { success: true, value: false }
        }
        return { success: true, value: true }
    }
}
