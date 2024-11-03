
async function checkInpage() {
    try {
        const { default: getATProtocolHundle } = await import(browser.runtime.getURL("/commonjs/getATProtocolHundle.js"))
        const hundle = await getATProtocolHundle(document.URL)
        document.getElementById("Bridgy-Fed-Finder")?.remove()
        var inpageNotice = document.createElement("div")
        inpageNotice.setAttribute("id", "Bridgy-Fed-Finder")
        var resultElem = document.createElement("p")
        resultElem.innerText = hundle
        resultElem.style.setProperty('position', 'absolute')
        inpageNotice.appendChild(resultElem)
        document.body.appendChild(inpageNotice)
    } catch (error) {
        document.getElementById("Bridgy-Fed-Finder")?.remove()
        console.debug("Brdgy Fed Finder: " + (browser.i18n.getMessage(error.message) || error.message))
    }
}

//navigate event doesn't work in some browser
document.addEventListener("click", checkInpage);
window.addEventListener("popstate", checkInpage);

checkInpage()