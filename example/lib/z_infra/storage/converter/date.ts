import { decodeError, decodeSuccess, TypedStorageConverter, TypedStorageValue } from "../infra"

export function initDateConverter(): TypedStorageConverter<Date> {
    return new Converter()
}

class Converter implements TypedStorageConverter<Date> {
    toRaw(value: Date): string {
        return value.toISOString()
    }
    toValue(raw: string): TypedStorageValue<Date> {
        const value = new Date(raw)
        if (value instanceof Date) {
            return decodeSuccess(value)
        }
        return decodeError(`decode date error: ${raw} -> null`)
    }
}
