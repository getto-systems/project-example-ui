import { CheckPasswordCharacterMethod } from "./method"

import { PasswordCharacterState } from "../x_Action/Password/data"

export const checkPasswordCharacter: CheckPasswordCharacterMethod = (password, post) => {
    post(state())

    function state(): PasswordCharacterState {
        for (let i = 0; i < password.length; i++) {
            // 1文字でも 128バイト以上の文字があれば complex
            if (password.charCodeAt(i) >= 128) {
                return { multiByte: true }
            }
        }
        return { multiByte: false }
    }
}
