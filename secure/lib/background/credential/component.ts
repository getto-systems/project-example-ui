import { FetchResponse } from "../../credential/data"

export interface BackgroundCredentialComponent {
    fetch(): FetchResponse
}
