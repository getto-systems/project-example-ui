import { h, render } from "preact"

import { newMoveToNextVersionAsSingle } from "../../../../update/x_components/MoveToNextVersion/EntryPoint/main/single"

import { EntryPoint } from "../../../../x_preact/update/MoveToLatestVersion/EntryPoint"

render(h(EntryPoint, newMoveToNextVersionAsSingle()), document.body)
