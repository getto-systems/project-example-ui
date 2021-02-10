export type RawAuthCredential = Readonly<{ ticketNonce: string; apiCredential: RawApiCredential }>
export type RawApiCredential = Readonly<{ apiRoles: string[] }>
