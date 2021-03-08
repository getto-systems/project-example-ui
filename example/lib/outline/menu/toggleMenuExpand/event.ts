import { RepositoryError } from "../../../z_vendor/getto-application/infra/repository/data"
import { Menu } from "../kernel/data"

export type ToggleMenuExpandEvent =
    | Readonly<{ type: "succeed-to-toggle"; menu: Menu }>
    | Readonly<{ type: "repository-error"; menu: Menu; err: RepositoryError }>
