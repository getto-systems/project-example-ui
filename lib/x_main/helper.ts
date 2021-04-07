import { WorkerOutsideFeature } from "../z_vendor/getto-application/action/worker/infra"
import { RemoteOutsideFeature } from "../z_vendor/getto-application/infra/remote/infra"
import { RepositoryOutsideFeature } from "../z_vendor/getto-application/infra/repository/infra"
import { LocationOutsideFeature } from "../z_vendor/getto-application/location/infra"

export function foregroundOutsideFeature(): RepositoryOutsideFeature &
    RemoteOutsideFeature &
    LocationOutsideFeature {
    return {
        webDB: indexedDB,
        webCrypto: crypto,
        currentLocation: location,
    }
}

export function backgroundOutsideFeature(): RepositoryOutsideFeature &
    RemoteOutsideFeature &
    WorkerOutsideFeature {
    return {
        webDB: indexedDB,
        webCrypto: crypto,
        worker: (self as unknown) as Worker,
    }
}
