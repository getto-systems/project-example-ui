export type RawAuthCredential = Readonly<{ ticketNonce: string; api: RawApiCredential }>
export type RawApiCredential = Readonly<{ apiNonce: string; apiRoles: string[] }>
