import { RenewRunner } from "../infra"

import { unpackAuthAt } from "../../credential/adapter"

import { AuthAt } from "../../credential/data"

export function initRenewRunner(): RenewRunner {
    return new Runner()
}

class Runner implements RenewRunner {
    nextRun(lastAuthAt: Found<AuthAt>, delay: DelayTime): DelayTime {
        if (!lastAuthAt.found) {
            return { delay_milli_second: 0 }
        }

        const delay_milli_second = unpackAuthAt(lastAuthAt.content).getTime() + delay.delay_milli_second - new Date().getTime()
        if (delay_milli_second < 0) {
            return { delay_milli_second: 0 }
        }
        return { delay_milli_second }
    }
}

type DelayTime = Readonly<{ delay_milli_second: number }>

type Found<T> =
    Readonly<{ found: false }> |
    Readonly<{ found: true, content: T }>
