import { RenewRunner } from "../infra"

import { unpackAuthAt } from "../../credential/adapter"

import { AuthAt } from "../../credential/data"

export function initRenewRunner(): RenewRunner {
    return new Runner()
}

class Runner implements RenewRunner {
    nextRun(lastAuthAt: AuthAt, delay: DelayTime): DelayTime {
        const delay_milli_second =
            unpackAuthAt(lastAuthAt).getTime() + delay.delay_milli_second - new Date().getTime()
        if (delay_milli_second < 0) {
            return { delay_milli_second: 0 }
        }
        return { delay_milli_second }
    }
}

type DelayTime = Readonly<{ delay_milli_second: number }>
