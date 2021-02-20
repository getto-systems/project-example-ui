import { h, render } from "preact"

import { newEntryPoint } from "../main/single"

import { EntryPoint } from "../x_preact/EntryPoint"

render(h(EntryPoint, newEntryPoint()), document.body)
