(async () => {
    const { default: translate } = await import("/commonjs/l10n.js")
    for (elem of document.querySelectorAll("[data-l10n]")) {
        elem.innerText = translate(elem.dataset.l10n)
    }
})();

async function listConfig() {
    var { default: config } = await import("/commonjs/conf.js")
    await config.$loaded
    for (elem of document.querySelectorAll("[data-configKey]")) {
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