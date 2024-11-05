export default async function checkNodeinfo(host, noCache = false) {
    const { saveCache: saveCache, getCache: getCache } = await import(browser.runtime.getURL("/commonjs/cache.js"))
    if (!noCache) {
        const cachedValue = await getCache(host)
        if (errors.includes(cachedValue)) {
            throw new Error(cachedValue)
        }
        if (cachedValue = "hostIsActivitypubServer") {
            return
        }
    }
    try {
        const nodeinfoListResponce = await fetch("https://" + host + "/.well-known/nodeinfo")
        const nodeinfoListJson = await nodeinfoListResponce.json()
        const nodeinfoResponce = await fetch(nodeinfoListJson.links[0].href)
        const nodeinfoJson = await nodeinfoResponce.json()
        if (nodeinfoJson.protocols.includes("activitypub")) {
            saveCache(host, "hostIsActivitypubServer")
            return
        }
    } catch (error) {
        console.debug(error)
        saveCache(host, "hostMustBeActivitypubServer")
        throw new Error("hostMustBeActivitypubServer")
    }
}

export const errors = ["hostIsActivitypubServer"]