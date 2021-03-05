import { markResetSessionID } from "../../../password/reset/kernel/testHelper"

import { newSignLinkResource } from "./impl"

describe("SignLink", () => {
    test("link", () => {
        const resource = newSignLinkResource()

        expect(resource.href.password_authenticate()).toEqual(
            "?_password_authenticate=authenticate",
        )
        expect(resource.href.password_reset_requestToken()).toEqual("?_password_reset=requestToken")
        expect(resource.href.password_reset_checkStatus(markResetSessionID("session-id"))).toEqual(
            "?_password_reset=checkStatus&_password_reset_session_id=session-id",
        )
    })
})
