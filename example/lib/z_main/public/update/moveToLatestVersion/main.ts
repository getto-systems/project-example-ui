import { h, render } from "preact"

import { newMoveToNextVersionAsSingle } from "../../../../update/x_components/MoveToNextVersion/EntryPoint/main/single"

import { MoveToLatestVersion } from "../../../../x_preact/update/MoveToLatestVersion/EntryPoint"

render(h(MoveToLatestVersion, { moveToNextVersion: newMoveToNextVersionAsSingle() }), document.body)
