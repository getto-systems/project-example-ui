import { h, render } from "preact"

import { newMoveToNextVersionAsSingle } from "../../../../update/Update/MoveToNextVersion/main/single"

import { MoveToLatestVersion } from "../../../../x_preact/public/Update/MoveToLatestVersion"

render(h(MoveToLatestVersion, { moveToNextVersion: newMoveToNextVersionAsSingle() }), document.body)
