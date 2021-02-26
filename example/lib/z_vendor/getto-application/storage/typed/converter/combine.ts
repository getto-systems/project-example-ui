import { TypedStorageValue, TypedStorageValueConverter } from "../infra"

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

    toRaw(value: T): R {
        return this.base.toRaw(this.extend.toRaw(value))
    }
    toValue(raw: R): TypedStorageValue<T> {
        const result = this.base.toValue(raw)
        if (result.decodeError) {
            return result
        }
        return this.extend.toValue(result.value)
    }
}
