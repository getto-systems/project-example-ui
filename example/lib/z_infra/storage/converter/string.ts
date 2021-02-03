import { TypedStorageConverter, TypedStorageDecoded } from "../infra"

export function initStringConverter(): TypedStorageConverter<string> {
    return new Converter()
}

class Converter implements TypedStorageConverter<string> {
    encode(value: string): string {
        return value
    }
    decode(raw: string): TypedStorageDecoded<string> {
        return { decodeError: false, value: raw }
    }
}
