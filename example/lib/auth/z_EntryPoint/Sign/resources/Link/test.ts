import { initAuthSignLinkResource } from "./impl"

describe("AuthSignLink", () => {
    test("link", (done) => {
        const resource = initAuthSignLinkResource()

        expect(resource.href.passwordLogin()).toEqual("?_password_login")
        expect(resource.href.passwordResetSession()).toEqual("?_password_reset=start")

        done()
    })
})
