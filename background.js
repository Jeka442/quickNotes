import { addNoteAsync, getNotesAsync } from '../ChromeStorage.js';


function PasteToElement(info, tab, text) {
    chrome.tabs.sendMessage(tab.id, { message: "pasteToInput", value: text }, { frameId: info.frameId });
}


chrome.storage.local.onChanged.addListener(async () => {
    await addContextMenu();
})

const addContextMenu = async () => {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        id: "QuickNotesAdd",
        title: "Save as Note",
        contexts: ["selection"]
    })
    const Notes = await getNotesAsync();
    if (Notes.length > 0) {
        chrome.contextMenus.create({
            id: "QuickNotes",
            title: "QuickPaste",
            contexts: ["editable"]
        })
        let index = 0;
        for (let note of Notes) {
            chrome.contextMenus.create({
                id: `${index++}-${note.id}`,
                parentId: "QuickNotes",
                title: `${note.value.substring(0, 7)}...`,
                contexts: ["all"]
            })
        }
    }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "QuickNotes") return;
    if (info.menuItemId === "QuickNotesAdd") {
        const value = info.selectionText;
        if (value) addNoteAsync(value);
    } else {
        const id = info.menuItemId;
        const noteId = id.substring(id.indexOf("-") + 1);
        getNotesAsync().then(Notes => {
            PasteToElement(info, tab, Notes.find(n => n.id === noteId).value)
        })
    }
});


addContextMenu();