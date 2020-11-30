import { newMoveToNextVersionAsSingle } from "../../update/Update/MoveToNextVersion/main"

import { appTargetToPath } from "../../update/next_version/data"

const moveToNextVersion = newMoveToNextVersionAsSingle()
const nextVersion = moveToNextVersion().components.nextVersion

nextVersion.onStateChange((state) => {
    switch (state.type) {
        case "succeed-to-find":
            // ロケーション情報を引き継いで遷移
            location.href = `${appTargetToPath(state.target)}/${location.search}${location.hash}`
            return

        default:
            // エラーや見つからなかった場合は対応しない
            return
    }
})

nextVersion.find()
