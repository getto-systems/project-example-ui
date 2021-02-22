import { newAuthSignLinkResource } from "./impl"

describe("AuthSignLink", () => {
    test("link", () => {
        const resource = newAuthSignLinkResource()

        expect(resource.href.password_authenticate()).toEqual("?_password_authenticate=authenticate")
        expect(resource.href.password_reset()).toEqual("?_password_reset=request")
    })
})
