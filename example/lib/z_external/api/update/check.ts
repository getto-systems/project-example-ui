export interface ApiUpdateCheck {
    (url: SendURL): Promise<RawCheckResult>
}

type SendURL = string

type RawCheckResult =
    | Readonly<{ success: false; err: RawError }>
    | Readonly<{ success: true; value: boolean }>

type RawError = Readonly<{ type: string; detail: string }>

export function initApiUpdateCheck(): ApiUpdateCheck {
    return async (url: SendURL): Promise<RawCheckResult> => {
        try {
            const response = await fetch(url, { method: "HEAD" })
            if (!response.ok) {
                if (response.status >= 500) {
                    return { success: false, err: { type: "server-error", detail: "" } }
                }
                return { success: true, value: false }
            }
            return { success: true, value: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", detail: `${err}` } }
        }
    }
}
