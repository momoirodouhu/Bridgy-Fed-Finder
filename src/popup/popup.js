
async function checkActivetab() {
    try {
        document.getElementById("open-bsky").disabled = true;
        tabs = await browser.tabs.query({ currentWindow: true, active: true })
        const { default: getATProtocolHundle } = await import("/commonjs/getATProtocolHundle.js")
        hundle = await getATProtocolHundle(tabs[0].url)
        document.getElementById("result").innerText = hundle
        document.getElementById("open-bsky").addEventListener('click', () => {
            window.open("https://bsky.app/profile/" + hundle, '_blank').focus()
            window.close()
        });
        document.getElementById("open-bsky").disabled = false;
    } catch (error) {
        document.getElementById("result").innerText = browser.i18n.getMessage(error.message) || error.message
    } finally {
        document.getElementById("activetab-loading").style.setProperty('display', 'none')
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