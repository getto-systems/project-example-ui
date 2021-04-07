import { h, render } from "preact"

import { newProfileView } from "../../../../auth/action_profile/init"

import { ProfileEntry } from "../../../../auth/action_profile/x_preact/profile"

render(
    h(
        ProfileEntry,
        newProfileView({
            webStorage: localStorage,
            webDB: indexedDB,
            webCrypto: crypto,
            currentLocation: location,
        }),
    ),
    document.body,
)
