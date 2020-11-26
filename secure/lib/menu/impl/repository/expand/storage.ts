import {
    CategoryLabelsSet,
    MenuExpandRepository,
    MenuExpandResponse,
    ToggleExpandResponse,
} from "../../../infra"

export function initStorageMenuExpandRepository(storage: Storage, key: string): MenuExpandRepository {
    return new Repository(storage, key)
}

class Repository implements MenuExpandRepository {
    storage: MenuExpandStorage
    set: CategoryLabelsSet

    restored = false

    constructor(storage: Storage, key: string) {
        this.storage = new MenuExpandStorage(storage, key)
        this.set = new CategoryLabelsSet()
    }

    restore(): void {
        if (!this.restored) {
            this.set.restore(this.storage.restore())
            this.restored = true
        }
    }

    findExpand(): MenuExpandResponse {
        try {
            this.restore()
            return { success: true, expand: this.set }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }

    setExpand(category: string[]): ToggleExpandResponse {
        try {
            this.restore()
            this.set.register(category)
            this.storage.store(this.set.set)
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
    clearExpand(category: string[]): ToggleExpandResponse {
        try {
            this.restore()
            this.set.remove(category)
            this.storage.store(this.set.set)
            return { success: true }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }
}

class MenuExpandStorage {
    storage: Storage
    key: string

    constructor(storage: Storage, key: string) {
        this.storage = storage
        this.key = key
    }

    restore(): string[][] {
        const raw = this.storage.getItem(this.key)
        if (!raw) {
            return []
        }
        const category = JSON.parse(raw)
        if (!validate(category)) {
            // 無効な形式で保存されていた場合は単に無視する
            return []
        }
        return category

        function validate(category: unknown): boolean {
            return (
                category instanceof Array &&
                category.every(
                    (value) => value instanceof Array && value.every((val) => typeof val === "string")
                )
            )
        }
    }
    store(category: string[][]): void {
        this.storage.setItem(this.key, JSON.stringify(category))
    }
}
