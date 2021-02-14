import { PasswordCharacterCheckerPod } from "../action"

export const passwordCharacterChecker = (): PasswordCharacterCheckerPod => () => (password) => {
    for (let i = 0; i < password.length; i++) {
        // 1文字でも 128バイト以上の文字があれば complex
        if (password.charCodeAt(i) >= 128) {
            return { complex: true }
        }
    }
    return { complex: false }
}
