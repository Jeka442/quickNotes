
function PasteToElement(info, tab, text) {
    chrome.tabs.sendMessage(tab.id, { message: "pasteToInput", value: text }, { frameId: info.frameId });
}


chrome.storage.local.onChanged.addListener(async () => {
    await addContextMenu();
})

const addContextMenu = async () => {
    await chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        id: "QuickNotesAdd",
        title: "Save as Note",
        contexts: ["selection"]
    })

    chrome.contextMenus.create({
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
}


const GetUuid = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
};

const addValueAsync = async (value) => {
    const list = await chrome.storage.local.get("Notes");
    let newList = [];
    if (list.Notes) newList = [...list.Notes];
    newList.push({ id: GetUuid(), value: value });
    chrome.storage.local.set({ Notes: newList });
}
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "QuickNotes") return;
    if (info.menuItemId === "QuickNotesAdd") {
        const value = info.selectionText;
        if (value) addValueAsync(value);
    } else {
        const id = info.menuItemId;
        const text = id.substring(id.indexOf("-") + 1);
        PasteToElement(info, tab, text)
    }
});


addContextMenu();