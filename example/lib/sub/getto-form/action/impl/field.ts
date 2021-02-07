import { FormField } from "../action"

import { FormConvertResult, FormValidationResult } from "../../data"

type FormFieldCore<T, E, I> = Readonly<{
    input: I
    validator: FormValidator<E, I>
    converter: FormConverter<T, I>
}>

interface FormValidator<E, I> {
    (input: I): FormValidationResult<E>
}
interface FormConverter<T, I> {
    (input: I): FormConvertResult<T>
}

export function initFormField<T, E, I>({
    input,
    validator,
    converter,
}: FormFieldCore<T, E, I>): FormField<T, E, I> {
    return {
        input,
        validate: () => validator(input),
        convert: () => {
            const result = validator(input)
            if (!result.valid) {
                return { success: false }
            }
            return converter(input)
        },
    }
}
