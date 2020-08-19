export type Login =
    Readonly<{ authorized: true }> |
    Readonly<{ authorized: false }>;

export const authorized: Login = { authorized: true }
export const unauthorized: Login = { authorized: false }

export type Password = Readonly<{
    loginID: string,
    password: string,
}>
