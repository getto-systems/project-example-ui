export interface BoardValidateStack {
    get(name: string): BoardValidateStackFound
    update(name: string, result: boolean): void
}

export type BoardValidateStackFound =
    | Readonly<{ found: true; state: boolean }>
    | Readonly<{ found: false }>
