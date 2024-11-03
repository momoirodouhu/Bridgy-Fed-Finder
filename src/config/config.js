(async () => {
    const { default: colorize } = await import("/commonjs/color.js")
    colorize(document)
    const { default: translate } = await import("/commonjs/l10n.js")
    for (elem of document.querySelectorAll("[data-l10n]")) {
        elem.innerText = translate(elem.dataset.l10n)
    }
})();

async function listConfig() {
    var { default: config } = await import("/commonjs/conf.js")
    await config.$loaded
    const { availableColors: availableColors } = await import("/commonjs/color.js")
    var colorThema = document.getElementById("colorThema")
    availableColors.forEach(color => {
        option = document.createElement("option")
        option.innerText = color
        option.value = color
        colorThema.appendChild(option)
    })
    colorThema.addEventListener("change", async () => {
        const { default: colorize } = await import("/commonjs/color.js")
        colorize(document)
    })
    var configElements = document.querySelectorAll("[data-configKey]")
    for (elem of configElements) {
        (elem.type == "checkbox" ? elem.checked = config[elem.dataset.configkey] : elem.value = config[elem.dataset.configkey])
        elem.addEventListener("change", (event) => {
            value = event.target.type == "checkbox" ? event.target.checked : event.target.value
            config[event.target.dataset.configkey] = value
            console.debug("config changed: " + event.target.dataset.configkey + " -> " + value)
        })
    }
    document.getElementById("config-loading").style.setProperty('display', 'none')
    document.getElementById("config-list").style.setProperty('display', 'block')
}

listConfig()