import { VNode } from "preact";
import { html } from "htm/preact";
import { useState, useEffect } from "preact/hooks";
import { LoadScriptComponent, LoadScriptState, LoadScriptError } from "../../load/load_script";

interface component {
    (): VNode;
}

export function LoadScript(component: LoadScriptComponent): component {
    return (): VNode => {
        const [view, setView] = useState<LoadScriptState>(component.initial);
        useEffect(() => {
            component.getScriptPath().then(setView).catch(errorView);
        }, []);

        useEffect(() => {
            if (view.state === "loaded") {
                const script = document.createElement("script");
                script.src = view.scriptPath;
                document.body.appendChild(script);
            }
        }, [view]);

        // script タグは body.appendChild しないとスクリプトがロードされない
        // script の描画は useEffect でするので、本体は空で返す
        return html``
    }

    function errorView(err: LoadScriptError): VNode {
        // TODO エラー画面を表示するように！
        // 「システムの起動に失敗しました」
        console.log(err);
        return html``
    }
}
