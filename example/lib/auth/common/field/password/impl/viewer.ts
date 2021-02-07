import { PasswordViewer, PasswordViewerPod } from "../action"
import { PasswordViewState } from "../data"

export const passwordViewer = (): PasswordViewerPod => () => {
    return new Viewer()
}

class Viewer implements PasswordViewer {
    view: PasswordViewState = { show: false }

    get(): PasswordViewState {
        return this.view
    }
    show(post: Post<PasswordViewState>): void {
        this.view = { show: true }
        post(this.view)
    }
    hide(post: Post<PasswordViewState>): void {
        this.view = { show: false }
        post(this.view)
    }
}

interface Post<T> {
    (state: T): void
}
