import { CurrentVersionInfra } from "../infra"

import { FindCurrentVersionPod } from "../action"

import { markVersion } from "../data"

export const findCurrentVersion = (infra: CurrentVersionInfra): FindCurrentVersionPod => () => (post) => {
    const { currentVersion } = infra

    post({ type: "succeed-to-find", version: markVersion(currentVersion) })
}
