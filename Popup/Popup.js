import { addNoteAsync, deleteNoteAsync, getNotesAsync, updateNoteValueAsync } from '../ChromeStorage.js';

var notes = document.getElementById("Notes");
var addBtn = document.getElementById("add-note-btn");

var note = (id, value) => {
  return `
        <div class="Note" data-for="${id}">
        <button>&#10005;</button>
        <textarea>${value}</textarea>
        <button>&#9986;</button>
        </div>
    `;
};

const updateContent = async (id, value) => {
  await updateNoteValueAsync(id, value);
};

const deleteNote = async (id) => {
  await deleteNoteAsync(id);
  printNotesOnScreen();
};


const addNewNote = async () => {
  await addNoteAsync("");
  printNotesOnScreen();
};

addBtn.addEventListener("click", addNewNote);

const bindEventsOnNotes = () => {
  const notes = document.getElementsByClassName("Note");
  for (let note of notes) {
    const noteId = note.getAttribute("data-for");
    const delBtn = note.getElementsByTagName("button")[0];
    const saveToClipBtn = note.getElementsByTagName("button")[1];
    const inp = note.getElementsByTagName("textarea")[0];
    //del btn by id
    delBtn.addEventListener("click", () => {
      deleteNote(noteId);
    });
    //copy btn
    saveToClipBtn.addEventListener("click", () => {
      var content = inp.value;
      navigator.clipboard.writeText(content);
    });
    //update content by id
    inp.addEventListener("change", (e) => {
      updateContent(noteId, e.target.value);
    });
  }
};

const printNotesOnScreen = async () => {
  notes.innerHTML = "";
  const SavedNotes = await getNotesAsync();
  let html = "";
  for (const singleNote of SavedNotes) {
    html += note(singleNote.id, singleNote.value);
  }
  notes.innerHTML = html;
  bindEventsOnNotes();
};
printNotesOnScreen();


