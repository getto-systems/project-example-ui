import { h, render } from "preact"

import { newMoveToNextVersionAsSingle } from "../../../../update/x_components/Update/MoveToNextVersion/main/single"

import { MoveToLatestVersion } from "../../../../x_preact/Update/MoveToLatestVersion/MoveToLatestVersion"

render(h(MoveToLatestVersion, { moveToNextVersion: newMoveToNextVersionAsSingle() }), document.body)
