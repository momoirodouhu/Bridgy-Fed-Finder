
export default async function getATProtocolHundle(url, noCache = false) {
    if (!noCache) {
        const { default: config } = await import(browser.runtime.getURL("/commonjs/conf.js"))
        await config.$loaded
        const sha256 = await crypto.subtle.digest('SHA-256', (new Uint16Array([].map.call(url, c => c.charCodeAt(0)))).buffer)
        const key = btoa(String.fromCharCode.apply(null, new Uint8Array(sha256)));
        const cachedValue = config.cache[key]
        if (cachedValue) {
            console.debug("cache found: " + url + " -> " + cachedValue)
            if (errors.includes(cachedValue)) {
                throw new Error(cachedValue)
            }
            return cachedValue
        }
    }
    const saveCache = async (url, hundle) => {
        const { default: config } = await import(browser.runtime.getURL("/commonjs/conf.js"))
        await config.$loaded
        const sha256 = await crypto.subtle.digest('SHA-256', (new Uint16Array([].map.call(url, c => c.charCodeAt(0)))).buffer)
        const key = btoa(String.fromCharCode.apply(null, new Uint8Array(sha256)));
        var newCache = JSON.parse(JSON.stringify(config.cache))
        newCache[key] = hundle;
        config.cache = newCache;
        console.debug("cached: " + url + " as " + key)
        console.debug(newCache)
    }
    var hundle = ""
    try {
        var activityPubUrl = new URL(url)
        activityPubUrl.searchParams.set("activitypub", true) //Explicitly difference requests because cloudflare doesn't respect Accept header
        const activityPubResponce = await fetch(activityPubUrl, {
            headers: { Accept: "application/activity+json", "Content-Type": "application/activity+json" }
        })
        const activityPubJson = await activityPubResponce.json()
        console.debug(activityPubJson)
        hundle = activityPubJson.preferredUsername + "." + new URL(activityPubJson.inbox).host + ".ap.brid.gy"
    } catch (error) {
        console.warn(error)
        saveCache(url, "UrlMustBeActivitypubActor")
        throw new Error("UrlMustBeActivitypubActor")
    }
    var blueskyResponce = {}
    var blueskyJson = {}
    try {
        hundle = hundle.replaceAll("~", "-").replaceAll("_", "-") //https://fed.brid.gy/docs#fediverse-get-started
        blueskyResponce = await fetch("https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=" + hundle)
        blueskyJson = await blueskyResponce.json()
        console.debug(blueskyJson)
    } catch (error) {
        console.warn(error)
        throw new Error("FailedToGetBlueskyProfile")
    }
    if (blueskyResponce.status != 200) {
        if (blueskyJson.message == "Profile not found") {
            saveCache(url, "NoAtprotocolProfileFound")
            throw new Error("NoAtprotocolProfileFound")
        }
        console.warn(blueskyJson)
        throw new Error("UnknownResponceFromBlueskyApi")
    }
    else {
        saveCache(url, hundle)
        return hundle
    }
}

export const errors = ["UrlMustBeActivitypubActor", "FailedToGetBlueskyProfile", "NoAtprotocolProfileFound", "UnknownResponceFromBlueskyApi"]