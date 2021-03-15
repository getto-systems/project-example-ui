import { BaseTypes } from "../action_base/entry_point"

type DashboardTypes = BaseTypes<EmptyResource>
type EmptyResource = {
    // no props
}
export type DashboardEntryPoint = DashboardTypes["entryPoint"]
export type DashboardResource = DashboardTypes["resource"]
