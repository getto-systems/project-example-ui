export type SignHref = string & { SignHref: never }

// ログイン前画面ではハイフンから始まるクエリを使用する
export const signLinkParams = {
    static: {
        key: "-static",
        variant: {
            "privacy-policy": true,
        }
    },
    password: {
        authenticate: {
            key: "-password-authenticate",
            variant: {
                authenticate: true,
            },
        },
        reset: {
            key: "-password-reset",
            sessionID: "-password-reset-session-id",
            token: "-password-reset-token",
            variant: {
                "request-token": true,
                "check-status": true,
                reset: true,
            },
        },
    },
} as const
