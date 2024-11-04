
async function checkActivetab() {
    document.getElementById("activetab-loading").style.setProperty('display', 'block')
    document.getElementById("reload").removeEventListener("click",checkActivetab)
    document.getElementById("reload").style.setProperty('display', 'none')
    document.getElementById("open-bsky").disabled = true;
    try {
        tabs = await browser.tabs.query({ currentWindow: true, active: true })
        const { default: getATProtocolHundle } = await import("/commonjs/getATProtocolHundle.js")
        hundle = await getATProtocolHundle(tabs[0].url,noCache = true)
        document.getElementById("result").innerText = hundle
        document.getElementById("open-bsky").addEventListener('click', () => {
            browser.tabs.create({url: "https://bsky.app/profile/" + hundle,})
            window.close()
        });
        document.getElementById("open-bsky").disabled = false;
    } catch (error) {
        document.getElementById("result").innerText = browser.i18n.getMessage(error.message) || error.message
    } finally {
        document.getElementById("activetab-loading").style.setProperty('display', 'none')
        document.getElementById("reload").style.setProperty('display', 'inline')
        document.getElementById("reload").addEventListener("click",checkActivetab)
    }
}

(async () => {
    const { default: colorize } = await import("/commonjs/color.js")
    colorize(document)
    const {default: translate} = await import("/commonjs/l10n.js")
    for (elem of document.querySelectorAll("[data-l10n]")) {
        elem.innerText = translate(elem.dataset.l10n)
    }
})()

checkActivetab()