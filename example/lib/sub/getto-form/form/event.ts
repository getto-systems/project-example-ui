import { FormHistory, FormInputString } from "./data"

export type FormInputEvent = Readonly<{ value: FormInputString }>
export type FormChangeEvent = Readonly<{ history: FormHistory }>
