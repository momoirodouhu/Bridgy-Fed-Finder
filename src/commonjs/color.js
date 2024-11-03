export default async function colorize(element) {
    var { default: config } = await import("/commonjs/conf.js")
    availableColors.forEach(color => {
        element.querySelectorAll(".Bridgy-Fed-Finder-" + color).forEach(elem => {
            elem.classList.remove("Bridgy-Fed-Finder-" + color)
        })
    })
    const BridgyFedFinder = element.querySelector("[class^=Bridgy-Fed-Finder-]")
    await config.$loaded
    if (!availableColors.includes(config.colorThema)) {
        console.log("color config is unknown value. foce to gray.")
        config.colorThema = "gray"
    }
    BridgyFedFinder.classList.add("Bridgy-Fed-Finder-" + config.colorThema)
}

export const availableColors = ["gray", "light","dark"]