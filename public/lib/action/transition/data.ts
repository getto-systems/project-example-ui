export type TransitionState<T> =
    Readonly<{ state: "initial" }> |
    Readonly<{ state: "stacked", view: T }> |
    Readonly<{ state: "registered", setter: TransitionSetter<T> }>;
export function initialTransition<T>(): TransitionState<T> {
    return { state: "initial" }
}
export function transitionStacked<T>(view: T): TransitionState<T> {
    return { state: "stacked", view }
}
export function transitionRegistered<T>(setter: TransitionSetter<T>): TransitionState<T> {
    return { state: "registered", setter }
}

export interface TransitionSetter<T> {
    (view: T): void;
}
