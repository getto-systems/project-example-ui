import { markResetSessionID } from "../../../password/reset/kernel/test_helper"

import { initSignLinkResource } from "./impl"

describe("SignLink", () => {
    test("link", () => {
        const resource = initSignLinkResource()

        expect(resource.href.static_privacy_policy()).toEqual("?-static=privacy-policy")
        expect(resource.href.password_authenticate()).toEqual(
            "?-password-authenticate=authenticate",
        )
        expect(resource.href.password_reset_requestToken()).toEqual(
            "?-password-reset=request-token",
        )
        expect(resource.href.password_reset_checkStatus(markResetSessionID("session-id"))).toEqual(
            "?-password-reset=check-status&-password-reset-session-id=session-id",
        )
    })
})
