var elm = null;


document.addEventListener("contextmenu", function (event) {
    elm = event.target;
}, true);


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "pasteToInput") {
        const tagName = elm.tagName.toLowerCase();
        if (tagName == "input" || tagName == "textarea" || tagName == "select") {
            let changeEvent = new Event("change", { bubbles: true, cancelable: true, composed: true });
            const valueToPaste = `${elm.value}${request.value}`;

            elm.value = valueToPaste;
            elm.innerText = valueToPaste;
            elm.dispatchEvent(changeEvent);
        } else {
            const innerText = `${elm.innerText}${request.value}`
            elm.innerText = innerText;
        }


    }
});

