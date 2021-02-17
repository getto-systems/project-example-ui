import { h, render } from "preact"

import { newEntryPoint } from "../main/single"

import { EntryPoint } from "./EntryPoint"

render(h(EntryPoint, newEntryPoint()), document.body)
