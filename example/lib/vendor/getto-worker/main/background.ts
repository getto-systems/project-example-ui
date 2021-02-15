export interface WorkerBackgroundHandler<M> {
    (message: M): void
}
