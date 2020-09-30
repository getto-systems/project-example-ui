import { FetchResponse } from "./data"

export interface CredentialAction {
    fetch(): FetchResponse
}
