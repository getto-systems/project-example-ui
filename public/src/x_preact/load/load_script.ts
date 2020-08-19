import { VNode } from "preact";
import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";
import { LoadScriptComponent } from "../../load/load_script";

export function LoadScript(component: LoadScriptComponent) {
    return (): VNode => {
        const [view, _setView] = useState(component.initial);

        useEffect(() => {
            const script = document.createElement("script");
            script.src = view.scriptPath;
            document.body.appendChild(script);
        }, [view]);

        return html``
    }
}
