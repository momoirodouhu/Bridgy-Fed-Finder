
export default async function getATProtocolHundle(activityPubUrl) {
    var hundle = ""
    try {
        activityPubUrl = new URL(activityPubUrl)
        activityPubUrl.searchParams.set("activitypub",true) //Explicitly difference requests because cloudflare doesn't respect Accept header
        const activityPubResponce = await fetch(activityPubUrl, {
            headers: { Accept: "application/activity+json", "Content-Type": "application/activity+json" }
        })
        const activityPubJson = await activityPubResponce.json()
        console.debug(activityPubJson)
        hundle = activityPubJson.preferredUsername + "." + new URL(activityPubJson.inbox).host + ".ap.brid.gy"
    } catch (error) {
        console.warn(error)
        throw new Error("UrlMustBeActivitypubActor")
    }
    var blueskyResponce = {}
    try {
        hundle = hundle.replaceAll("~", "-").replaceAll("_", "-") //https://fed.brid.gy/docs#fediverse-get-started
        blueskyResponce = await fetch("https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=" + hundle)
        const blueskyJson = await blueskyResponce.json()
        console.debug(blueskyJson)
    } catch (error) {
        console.warn(error)
        throw new Error("FailedToGetBlueskyProfile")
    }
    if (blueskyResponce.status != 200) {
        if (blueskyJson.message == "Profile not found") {
            throw new Error("NoAtprotocolProfileFound")
        }
        console.warn(blueskyJson)
        throw new Error("UnknownResponceFromBlueskyApi")
    }
    else {
        return hundle
    }
}