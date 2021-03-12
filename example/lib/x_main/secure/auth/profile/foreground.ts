import { h, render } from "preact"

import { newProfileEntryPoint } from "../../../../auth/view_profile/init"

import { Profile } from "../../../../auth/view_profile/x_preact/profile"

render(
    h(
        Profile,
        newProfileEntryPoint({
            webStorage: localStorage,
            currentLocation: location,
        }),
    ),
    document.body,
)
