
function PasteToElement(info, tab, text) {
    chrome.tabs.sendMessage(tab.id, { message: "pasteToInput", value:text }, { frameId: info.frameId });
}

chrome.storage.local.onChanged.addListener(async () => {
    await chrome.contextMenus.removeAll();
    await chrome.contextMenus.create({
        id: "QuickNotes",
        title: "QuickPaste",
        contexts: ["editable"]
    })
    const Notes = await chrome.storage.local.get("Notes");
    if (Notes?.Notes) {
        let index = 0;
        for (let note of Notes.Notes) {
            chrome.contextMenus.create({
                id: `${index++}-${note.value}`,
                parentId: "QuickNotes",
                title: `${note.value.substring(0, 7)}...`,
                contexts: ["all"]
            })
        }
    }
})
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const id = info.menuItemId;
    const text = id.substring(id.indexOf("-") + 1);
    PasteToElement(info, tab, text)
});
