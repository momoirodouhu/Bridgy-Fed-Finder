
export default async function getATProtocolHundle(url, noCache = false) {
    const { saveCache: saveCache, getCache: getCache } = await import(browser.runtime.getURL("/commonjs/cache.js"))
    if (!noCache) {
        const cachedValue = await getCache(url)
        if (errors.includes(cachedValue)) {
            throw new Error(cachedValue)
        }
        if(cachedValue){
            return cachedValue
        }
    }
    const {default: checkNodeinfo} = await import(browser.runtime.getURL("/commonjs/checkNodeinfo.js"))
    await checkNodeinfo(new URL(url).host,noCache = noCache)
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

const {errors: checkNodeinfoErrors} = await import(browser.runtime.getURL("/commonjs/checkNodeinfo.js"))
export const errors = ["UrlMustBeActivitypubActor", "FailedToGetBlueskyProfile", "NoAtprotocolProfileFound", "UnknownResponceFromBlueskyApi",
        ...checkNodeinfoErrors]