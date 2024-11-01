
async function getATProtocolHundle(ActivityPubUrl) {
    var hundle = ""
    try {
        activityPubResponce = await fetch(ActivityPubUrl, {headers:{ Accept: "application/activity+json ", "Content-Type": "application/activity+json" }})
        activityPubJson = await activityPubResponce.json()
        console.debug(activityPubJson)
        hundle = activityPubJson.preferredUsername + "." + new URL(activityPubJson.inbox).host + ".ap.brid.gy"
    } catch (error) {
        console.warn(error)
        throw new Error("Url is not a activitypub actor")
    }
    try{
        blueskyResponce = await fetch("https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=" + hundle)
        blueskyJson = await blueskyResponce.json()
        console.debug(blueskyJson)
    } catch(error) {
        console.warn(error)
        throw new Error("Failed to get profile")
    }
    if (blueskyResponce.status != 200) {
        if(blueskyJson.message == "Profile not found"){
            throw new Error("No atprotocol profile found")
        }
        console.warn(blueskyJson)
        throw new Error("Unknown responce from bluesky api")
    }
    else {
        return hundle
    }
}

async function checkActivetab() {
    try {
        document.getElementById("open-bsky").disabled = true;
        tabs = await browser.tabs.query({ currentWindow: true, active: true })
        hundle = await getATProtocolHundle(tabs[0].url)
        document.getElementById("result").innerText = hundle
        document.getElementById("open-bsky").addEventListener('click', () => {
            window.open("https://bsky.app/profile/" + hundle, '_blank').focus()
            window.close()
        });
        document.getElementById("open-bsky").disabled = false;
    } catch(error) {
        document.getElementById("result").innerText = error
    } finally {
        document.getElementById("activetab-loading").style.setProperty('display', 'none')
    }
}

checkActivetab()