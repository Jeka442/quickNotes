var elm = null;


document.addEventListener("contextmenu", function (event) {
    elm = event.target;
}, true);


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "pasteToInput") {
        const tagName = elm.tagName.toLowerCase();
        const elmVal = elm.value;
        const elmInnerText = elm.innerText;
        let valueToPaste = ""
        if (tagName == "input" || tagName == "textarea" || tagName == "select") {
            valueToPaste = margeValues(elmVal, request.value);
            let changeEvent = new Event("change", { bubbles: true, cancelable: true, composed: true });
            elm.value = valueToPaste;
            elm.innerText = valueToPaste;
            elm.dispatchEvent(changeEvent);
        } else {
            valueToPaste = margeValues(elmInnerText, request.value);
            elm.innerText = valueToPaste;
        }
    }
});

const margeValues = (nullableValue, value) => {
    if (nullableValue != undefined && nullableValue != null && nullableValue != "") return `${nullableValue}${value}`
    return value
}