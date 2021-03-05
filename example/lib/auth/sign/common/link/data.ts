export type SignHref = string & { SignHref: never }

// ログイン前画面ではアンダースコアから始まるクエリを使用する
export const signLinkParams = {
    password: {
        authenticate: {
            key: "_password_authenticate",
            variant: {
                authenticate: true,
            },
        },
        reset: {
            key: "_password_reset",
            sessionID: "_password_reset_session_id",
            token: "_password_reset_token",
            variant: {
                requestToken: true,
                checkStatus: true,
                reset: true,
            },
        },
    },
} as const
