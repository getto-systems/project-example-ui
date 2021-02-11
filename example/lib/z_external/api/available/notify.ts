export interface ApiAvailableNotify {
    (err: SendError): Promise<RawNotifyResult>
}

type SendError = unknown

type RawNotifyResult =
    | Readonly<{ success: false; err: RawError }>
    | Readonly<{ success: true; value: true }>

type RawError = Readonly<{ type: string; detail: string }>

export function initApiAvailableNotify(apiServerURL: string): ApiAvailableNotify {
    return async (err: SendError): Promise<RawNotifyResult> => {
        await fetch(apiServerURL, {
            method: "POST",
            headers: [["Content-Type", "application/json"]],
            body: JSON.stringify(err),
        })
        return { success: true, value: true }
    }
}
