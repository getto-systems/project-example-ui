import { CheckPasswordCharacterMethod } from "./method"

export const checkPasswordCharacter: CheckPasswordCharacterMethod = (password) => {
    for (let i = 0; i < password.length; i++) {
        // 1文字でも 128バイト以上の文字があれば complex
        if (password.charCodeAt(i) >= 128) {
            return { multiByte: true }
        }
    }
    return { multiByte: false }
}
