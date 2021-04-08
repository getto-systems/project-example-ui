import { newFindNextVersionView } from "../../../../avail/version/action_find_next/init"

import { MoveToNextVersionEntry } from "../../../../avail/version/action_find_next/x_plain/move_to_next_version"
import { foregroundOutsideFeature } from "../../../x_outside_feature/common"

MoveToNextVersionEntry(newFindNextVersionView(foregroundOutsideFeature()))
