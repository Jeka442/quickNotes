var notes = document.getElementById("Notes");
var addBtn = document.getElementById("add-note-btn");

const storageKeys = {
  Notes: "Notes",
};

const getNoteContent = async (id) => {
  const SavedNotes = await chrome.storage.local.get(storageKeys.Notes);
  if (SavedNotes?.Notes) {
    const found = SavedNotes.Notes.find((x) => x.id === id);
    if (!found) return "";
    return found.value;
  }
  return "";
};

const updateContent = async (id, value) => {
  const SavedNotes = await chrome.storage.local.get(storageKeys.Notes);
  if (SavedNotes?.Notes) {
    const found = SavedNotes.Notes.find((x) => x.id === id);
    if (!found) return;
    found.value = value;
    const newList = SavedNotes.Notes.map((n) => {
      if (n.id === id) return found;
      return n;
    });
    await chrome.storage.local.set({
      [storageKeys.Notes]: newList,
    });
  }
};

const deleteNote = async (id) => {
  const SavedNotes = await chrome.storage.local.get(storageKeys.Notes);
  if (SavedNotes?.Notes) {
    const found = SavedNotes.Notes.find((x) => x.id === id);
    if (!found) return;
    await chrome.storage.local.set({
      [storageKeys.Notes]: SavedNotes.Notes.filter((x) => x.id !== id),
    });
    printNotesOnScreen();
  }
};

const GetUuid = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

const addNewNote = async () => {
  const id = GetUuid();
  const SavedNotes = await chrome.storage.local.get(storageKeys.Notes);
  let notesList = [];
  if (SavedNotes?.Notes) {
    notesList = [...SavedNotes.Notes];
  }
  notesList.push({ id: id, value: "" });
  await chrome.storage.local.set({ [storageKeys.Notes]: notesList });
  printNotesOnScreen();
};

addBtn.addEventListener("click", () => {
  addNewNote();
});

const bindEventsOnNotes = () => {
  const notes = document.getElementsByClassName("Note");
  for (let note of notes) {
    const noteId = note.getAttribute("data-for");
    //copy btn
    note.getElementsByTagName("button")[0].addEventListener("click", () => {
      console.log("here");
      var content = note.getElementsByTagName("input")[0].value;
      navigator.clipboard.writeText(content);
    });
    //update content by id
    note.getElementsByTagName("input")[0].addEventListener("change", (e) => {
      updateContent(noteId, e.target.value);
    });
    //del btn by id
    note.getElementsByTagName("button")[1].addEventListener("click", () => {
      deleteNote(noteId);
    });
  }
};

const printNotesOnScreen = async () => {
  notes.innerHTML = "";
  const SavedNotes = await chrome.storage.local.get(storageKeys.Notes);
  let html = "";
  if (SavedNotes?.Notes) {
    for (const singleNote of SavedNotes.Notes) {
      html += note(singleNote.id, singleNote.value);
    }
  }
  notes.innerHTML = html;
  bindEventsOnNotes();
};
printNotesOnScreen();

var note = (id, value) => {
  return `
        <div class="Note" data-for="${id}">
            <button>copy</button>
            <input value="${value}"/>
            <button>del</button>
        </div>
    `;
};
