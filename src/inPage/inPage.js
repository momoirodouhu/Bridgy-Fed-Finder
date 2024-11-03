
async function checkInpage() {
    try {
        const { default: getATProtocolHundle } = await import(browser.runtime.getURL("/commonjs/getATProtocolHundle.js"))
        const hundle = await getATProtocolHundle(document.URL)
        var inpageNotice = document.createElement("div")
        inpageNotice.setAttribute("id", "Bridgy-Fed-Finder")
        var resultElem = document.createElement("p")
        resultElem.innerText = hundle
        resultElem.style.setProperty('position', 'absolute')
        inpageNotice.appendChild(resultElem)
        document.body.appendChild(inpageNotice)
    } catch (error) {
        console.debug("Brdgy Fed Finder: " + (browser.i18n.getMessage(error.message) || error.message))
    }
}

checkInpage()