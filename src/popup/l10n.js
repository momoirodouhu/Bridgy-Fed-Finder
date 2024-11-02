
translate = key => browser.i18n.getMessage(key) || key

for (elem of document.querySelectorAll("[data-l10n]")){
    elem.innerText = translate(elem.dataset.l10n)
}
