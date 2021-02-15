import { initSignLinkResource } from "./impl"

describe("SignLink", () => {
    test("link", (done) => {
        const resource = initSignLinkResource()

        expect(resource.href.passwordLogin()).toEqual("?_password_login")
        expect(resource.href.passwordResetSession()).toEqual("?_password_reset=start")

        done()
    })
})
