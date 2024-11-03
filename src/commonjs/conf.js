const { default: Configs } = await import(browser.runtime.getURL("/commonjs/webextensions-lib-configs.js"))

var config = new Configs({
    enableInpageCheck: false,
    colorThema: "gray"
})

export default config