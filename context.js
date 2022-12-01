var elm = null;


document.addEventListener("contextmenu", function (event) {
    elm = event.target;
}, true);


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "pasteToInput") {
        const tagName = elm.tagName.toLowerCase();
        if (tagName == "input" || tagName == "textarea" || tagName == "select") {
            let changeEvent = new Event("change", { bubbles: true, cancelable: true, composed: true });
            elm.setAttribute("value", request.value);
            elm.innerText = request.value;
            elm.dispatchEvent(changeEvent);
        } else {
            elm.innerText = request.value;
        }


    }
});

