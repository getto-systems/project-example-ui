import { RenewRunner } from "../infra"

import { AuthAt } from "../../credential/data"

export function initRenewRunner(): RenewRunner {
    return new Runner()
}

class Runner implements RenewRunner {
    nextRun(lastAuthAt: AuthAt, delay: DelayTime): DelayTime {
        const delay_millisecond = lastAuthAt.getTime() + delay.delay_millisecond - new Date().getTime()
        if (delay_millisecond < 0) {
            return { delay_millisecond: 0 }
        }
        return { delay_millisecond }
    }
}

type DelayTime = Readonly<{ delay_millisecond: number }>
