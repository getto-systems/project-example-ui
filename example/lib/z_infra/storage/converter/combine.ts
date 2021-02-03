import { TypedStorageDecoded, TypedStorageValueConverter } from "../infra"

export function combineConverter<T, M, R>(
    base: TypedStorageValueConverter<M, R>,
    extend: TypedStorageValueConverter<T, M>
): TypedStorageValueConverter<T, R> {
    return new CombineConverter(base, extend)
}

class CombineConverter<T, M, R> implements TypedStorageValueConverter<T, R> {
    base: TypedStorageValueConverter<M, R>
    extend: TypedStorageValueConverter<T, M>

    constructor(base: TypedStorageValueConverter<M, R>, extend: TypedStorageValueConverter<T, M>) {
        this.base = base
        this.extend = extend
    }

    encode(value: T): R {
        return this.base.encode(this.extend.encode(value))
    }
    decode(raw: R): TypedStorageDecoded<T> {
        const result = this.base.decode(raw)
        if (result.decodeError) {
            return result
        }
        return this.extend.decode(result.value)
    }
}
