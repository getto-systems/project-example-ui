export type Icon = Readonly<{ type: "LineIcons"; style: "regular" | "light"; name: string }>

export function lnir(name: string): Icon {
    return { type: "LineIcons", style: "regular", name }
}
export function lnil(name: string): Icon {
    return { type: "LineIcons", style: "light", name }
}

export function iconClass(icon: Icon): string {
    switch (icon.type) {
        case "LineIcons":
            switch (icon.style) {
                case "regular":
                    return `lnir lnir-${icon.name}`
                case "light":
                    return `lnil lnil-${icon.name}`
            }
    }
}
