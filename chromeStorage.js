
const storageKeys = {
    Notes: "Notes",
};
const GetUuid = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
};

export const getNotesAsync = async () => {
    const SavedNotes = await chrome.storage.local.get(storageKeys.Notes);
    if (!SavedNotes.Notes) return [];
    return SavedNotes.Notes;
}

export const deleteNoteAsync = async (id) => {
    const SavedNotes = await getNotesAsync();
    await setNoteListAsync(SavedNotes.filter((note) => note.id !== id));
}


export const addNoteAsync = async (value) => {
    const noteList = await getNotesAsync();
    const id = GetUuid();
    noteList.push({ id: id, value: value });
    await setNoteListAsync(noteList);
}

export const updateNoteValueAsync = async (id, value) => {
    const SavedNotes = await getNotesAsync();
    const found = SavedNotes.find((x) => x.id === id);
    if (!found) return;
    found.value = value;
    const newList = SavedNotes.map((note) => {
        if (note.id === id) return found;
        return note;
    });
    await setNoteListAsync(newList);

};

export const setNoteListAsync = async (noteList) => {
    await chrome.storage.local.set({
        [storageKeys.Notes]: noteList,
    });
}