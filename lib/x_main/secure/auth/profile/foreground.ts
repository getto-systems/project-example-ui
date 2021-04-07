import { h, render } from "preact"

import { foregroundOutsideFeature } from "../../../outside_feature/helper"

import { newProfileView } from "../../../../auth/action_profile/init"

import { ProfileEntry } from "../../../../auth/action_profile/x_preact/profile"

render(h(ProfileEntry, newProfileView(foregroundOutsideFeature())), document.body)
