import { VNode } from "preact";
import { html } from "htm/preact";
import { useState, /* useEffect */ } from "preact/hooks";
import { PasswordLoginComponent, PasswordLoginState, /* PasswordLoginError */ } from "../../load/password_login";

interface component {
    (): VNode;
}

export function PasswordLogin(component: PasswordLoginComponent): component {
    return (): VNode => {
        const [_view, _setView] = useState<PasswordLoginState>(component.initial);

        return html`ここでパスワードログイン！`
    }
}
