import { ApplicationAbstractAction } from "../../../../application/impl"

import { convertBoard, validateBoard, ValidateBoardEmbed } from "../../impl"

import { ValidateBoardInfra } from "../../infra"

import { ValidateBoardAction, ValidateBoardMaterial, ValidateBoardState } from "./action"

import { BoardConvertResult } from "../../../kernel/data"

export function initValidateBoardAction<N extends string, T>(
    embed: ValidateBoardEmbed<N, T>,
    infra: ValidateBoardInfra
): ValidateBoardAction<T> {
    return new Action({
        convert: convertBoard(embed),
        validate: validateBoard(embed, infra),
    })
}

class Action<T>
    extends ApplicationAbstractAction<ValidateBoardState>
    implements ValidateBoardAction<T> {
    material: ValidateBoardMaterial<T>

    constructor(material: ValidateBoardMaterial<T>) {
        super()
        this.material = material
    }

    get(): BoardConvertResult<T> {
        switch (this.material.validate()) {
            case "initial":
            case "invalid":
                return { success: false }

            case "valid":
                return this.material.convert()
        }
    }
    check(): void {
        this.post(this.material.validate())
    }
}
