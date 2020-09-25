import { LoadApplicationParam } from "./component"

import { PagePathname } from "../../../script/data"

export function packLoadApplicationParam(pagePathname: PagePathname): LoadApplicationParam {
    return { pagePathname } as LoadApplicationParam & Param
}

export function unpackLoadApplicationParam(param: LoadApplicationParam): Param {
    return param as unknown as Param
}

type Param = {
    pagePathname: PagePathname
}
