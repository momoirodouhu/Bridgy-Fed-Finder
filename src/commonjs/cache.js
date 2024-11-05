export async function saveCache (key, data){
    const { default: config } = await import(browser.runtime.getURL("/commonjs/conf.js"))
    await config.$loaded
    const sha256 = await crypto.subtle.digest('SHA-256', (new Uint16Array([].map.call(key, c => c.charCodeAt(0)))).buffer)
    const hashedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(sha256)));
    var newCache = JSON.parse(JSON.stringify(config.cache))
    newCache[hashedKey] = data;
    config.cache = newCache;
    console.debug("cached: " + key + " as " + hashedKey)
}
export async function getCache(key){
    const { default: config } = await import(browser.runtime.getURL("/commonjs/conf.js"))
    await config.$loaded
    const sha256 = await crypto.subtle.digest('SHA-256', (new Uint16Array([].map.call(key, c => c.charCodeAt(0)))).buffer)
    const hashedKey = btoa(String.fromCharCode.apply(null, new Uint8Array(sha256)));
    const cachedValue = config.cache[hashedKey]
    if (cachedValue) {
        console.debug("cache found: " + url + " -> " + cachedValue)
        return cachedValue
    }
}