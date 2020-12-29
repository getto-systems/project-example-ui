import {
    MenuExpand,
    MenuExpandRepository,
    MenuExpandResponse,
    ToggleExpandResponse,
} from "../../../infra"

export function initStorageMenuExpandRepository(storage: Storage, key: string): MenuExpandRepository {
    return new Repository(storage, key)
}

class Repository implements MenuExpandRepository {
    storage: MenuExpandStorage

    restored = false

    constructor(storage: Storage, key: string) {
        this.storage = new MenuExpandStorage(storage, key)
    }

    findMenuExpand(): MenuExpandResponse {
        try {
            return { success: true, menuExpand: this.storage.restore() }
        } catch (err) {
            return { success: false, err: { type: "infra-error", err: `${err}` } }
        }
    }

    saveMenuExpand(menuExpand: MenuExpand): ToggleExpandResponse {
        try {
            this.storage.store(menuExpand)
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

    restore(): MenuExpand {
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
    store(category: MenuExpand): void {
        this.storage.setItem(this.key, JSON.stringify(category))
    }
}
