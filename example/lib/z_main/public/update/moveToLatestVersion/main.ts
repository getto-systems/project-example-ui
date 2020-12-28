import { h, render } from "preact"

import { newMoveToNextVersionAsSingle } from "../../../../update/Update/MoveToNextVersion/main/single"

import { MoveToNextVersion } from "../../../../x_preact/public/Update/MoveToNextVersion"

render(h(MoveToNextVersion, { moveToNextVersion: newMoveToNextVersionAsSingle() }), document.body)
