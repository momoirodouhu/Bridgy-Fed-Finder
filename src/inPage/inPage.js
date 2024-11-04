
async function checkInpage() {
    try {
        const { default: getATProtocolHundle } = await import(browser.runtime.getURL("/commonjs/getATProtocolHundle.js"))
        var url = new URL(document.URL)
        url.search = ""
        url.hash = ""
        const hundle = await getATProtocolHundle(url)
        await removeNoticeUI()
        await addNoticeUI(hundle)
    } catch (error) {
        await removeNoticeUI()
        console.debug("Brdgy Fed Finder: " + error.message)
    }
}

async function addNoticeUI(hundle) {
    htmlText = await (await fetch(browser.runtime.getURL("/inPage/inPageFoundUI.html"))).text()
    const inPageFoundUI = new DOMParser().parseFromString(htmlText, "text/html").body.firstElementChild
    inPageFoundUI.setAttribute("id", "Bridgy-Fed-Finder-inpage")
    inPageFoundUI.querySelector("#result").innerText = hundle
    inPageFoundUI.querySelector("#open-bsky").addEventListener('click', () => {
        window.open("https://bsky.app/profile/" + hundle, '_blank').focus()
    });
    inPageFoundUI.querySelector("#open-bsky").disabled = false;
    const { default: colorize } = await import(browser.runtime.getURL("/commonjs/color.js"))
    colorize(inPageFoundUI.parentElement)
    const { default: translate } = await import(browser.runtime.getURL("/commonjs/l10n.js"))
    for (elem of inPageFoundUI.querySelectorAll("[data-l10n]")) {
        elem.innerText = translate(elem.dataset.l10n)
    }
    document.body.appendChild(inPageFoundUI)
}

async function removeNoticeUI() {
    document.getElementById("Bridgy-Fed-Finder-inpage")?.remove()
}

(async () => {
    const { default: config } = await import(browser.runtime.getURL("/commonjs/conf.js"))
    await config.$loaded

    if (config["enableInpageCheck"]) {
        //navigate event doesn't work in some browser
        document.addEventListener("click", checkInpage);
        window.addEventListener("popstate", checkInpage);

        checkInpage()
    } else {
        console.debug("Bridgy-Fed-Finder inpageCheck disabled")
    }
})();