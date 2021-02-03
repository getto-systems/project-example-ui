import { TypedStorageConverter, TypedStorageDecoded } from "../infra"

export function initDateConverter(): TypedStorageConverter<Date> {
    return new Converter()
}

class Converter implements TypedStorageConverter<Date> {
    encode(value: Date): string {
        return value.toISOString()
    }
    decode(raw: string): TypedStorageDecoded<Date> {
        const value = new Date(raw)
        if (value instanceof Date) {
            return { decodeError: false, value }
        }
        return { decodeError: true, err: `date decode error: ${raw} -> null` }
    }
}
