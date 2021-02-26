import { ApplicationAbstractStateAction } from "../../../../action/impl"

import { convertBoard, validateBoard, ValidateBoardEmbed } from "../../impl"

import { ValidateBoardInfra } from "../../../kernel/infra"

import { initialValidateBoardState, ValidateBoardAction, ValidateBoardMaterial, ValidateBoardActionState } from "./action"

import { ConvertBoardResult } from "../../../kernel/data"

export function initValidateBoardAction<N extends string, T>(
    embed: ValidateBoardEmbed<N, T>,
    infra: ValidateBoardInfra,
): ValidateBoardAction<T> {
    return new Action({
        convert: convertBoard(embed),
        validate: validateBoard(embed, infra),
    })
}

class Action<T>
    extends ApplicationAbstractStateAction<ValidateBoardActionState>
    implements ValidateBoardAction<T> {
    readonly initialState: ValidateBoardActionState = initialValidateBoardState

    material: ValidateBoardMaterial<T>

    constructor(material: ValidateBoardMaterial<T>) {
        super()
        this.material = material
    }

    get(): ConvertBoardResult<T> {
        switch (this.material.validate()) {
            case "initial":
            case "invalid":
                return { valid: false }

            case "valid":
                return this.material.convert()
        }
    }
    check(): void {
        this.post(this.material.validate())
    }
}
