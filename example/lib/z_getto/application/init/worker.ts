type OutsideFeature = Readonly<{
    currentScript: HTMLScriptElement | SVGScriptElement | null
}>
export function newWorker(feature: OutsideFeature): Worker {
    const { currentScript } = feature
    const src = currentScript?.getAttribute("src")
    if (!src) {
        throw new Error("invalid script src")
    }
    return new Worker(src.replace(/\.js$/, ".worker.js"))
}
