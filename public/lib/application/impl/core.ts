import { Infra } from "../infra"

import { packScriptPath, unpackPagePathname } from "../adapter"

import { PathFactory } from "../action"

import { PagePathname, ScriptPath } from "../data"

const secureScriptPath = ({ host: { secureServerHost } }: Infra) => (pagePathname: PagePathname): ScriptPath => {
    // secure host にアクセス中の html と同じパスで js がホストされている
    return packScriptPath(`//${secureServerHost}${unpackPagePathname(pagePathname).replace(/\.html$/, "")}.js`)
}

export function initPathFactory(infra: Infra): PathFactory {
    return () => {
        return {
            secureScriptPath: secureScriptPath(infra),
        }
    }
}
