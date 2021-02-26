export type ValidateBoardInfra = Readonly<{
    stack: ValidateBoardStack
}>

export interface ValidateBoardStack {
    get(name: string): ValidateBoardStateFound
    update(name: string, result: boolean): void
}

export type ValidateBoardStateFound =
    | Readonly<{ found: true; state: boolean }>
    | Readonly<{ found: false }>
