export type Password = Readonly<{
    loginID: Readonly<LoginID>,
    password: Readonly<RawPassword>,
}>

export type LoginID = string;
export type RawPassword = string;
