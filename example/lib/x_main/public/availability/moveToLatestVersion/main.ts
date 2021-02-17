import { h, render } from "preact"

import { newMoveToNextVersionAsSingle } from "../../../../availability/z_EntryPoint/MoveToNextVersion/main/single"

import { EntryPoint } from "../../../../x_preact/availability/MoveToLatestVersion/EntryPoint"

render(h(EntryPoint, newMoveToNextVersionAsSingle()), document.body)
