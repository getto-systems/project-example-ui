import {
    TransitionState, initialTransition, transitionStacked, transitionRegistered,
    TransitionSetter,
} from "../action/transition/data";

export class Transitioner<T> {
    state: TransitionState<T>

    constructor() {
        this.state = initialTransition();
    }

    transitionTo(view: T): void {
        switch (this.state.state) {
            case "initial":
            case "stacked":
                this.state = transitionStacked(view);
                return;

            case "registered":
                this.state.setter(view);
                return;

            default:
                return assertNever(this.state);
        }
    }

    register(setter: TransitionSetter<T>): void {
        if (this.state.state === "stacked") {
            ((view) => {
                setTimeout(() => {
                    setter(view);
                }, 0);
            })(this.state.view);
        }

        this.state = transitionRegistered(setter);
    }
}

function assertNever(_: never): never {
    throw new Error("NEVER");
}
