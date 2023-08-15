displayNotesList();
applyListeners();

function applyListeners() {
  const saveButtonEl = document.querySelector(".save-note");

  saveButtonEl.addEventListener("click", clickSaveButton);

  const noteEntriesEls = document.querySelectorAll(".note-entry");

  noteEntriesEls.forEach((noteEntry) => {
    noteEntry.addEventListener("click", () =>
      selectNote(noteEntry.getAttribute("data-id"))
    );
  });

  const newNoteButtonEl = document.querySelector(".create-new");

  newNoteButtonEl.addEventListener("click", newNote);
}

function displayNotesList() {
  const notes = NotesAPI.getNotes();

  const sortedNotes = notes.sort(
    (noteA, noteB) => noteB.lastUpdated - noteA.lastUpdated
  );

  let html = "";

  // TODO: escape html for title and content <- UNBEDINGT INS TUTORIAL DEMONSTIEREN
  sortedNotes.forEach((note) => {
    html += `
            <div class="note-entry" data-id="${note.id}">
                <div class="note-title">${escapeHtml(note.title)}</div>
                <div class="note-content-teaser">${escapeHtml(
                  note.content
                )}</div>
                <div class="note-date">${new Date(
                  note.lastUpdated
                ).toLocaleString("de-DE")}</div>
            </div>`;
  });

  const notesListEl = document.querySelector(".notes-list");

  notesListEl.innerHTML = html;
}

function clickSaveButton() {
  const titleInputEl = document.getElementById("title-input");
  const contentInputEl = document.getElementById("content-input");

  const title = titleInputEl.value;
  const content = contentInputEl.value;

  if (!title || !content) {
    alert("Bitte Titel und Inhalt eingeben");
    return;
  }

  const idStoreEl = document.getElementById("note-id-store");

  const currentId = idStoreEl.getAttribute("data-id");

  NotesAPI.saveNote(title, content, Number(currentId));

  titleInputEl.value = "";
  contentInputEl.value = "";

  displayNotesList();
  applyListeners();
}

function selectNote(id) {
  const selectedNoteEl = document.querySelector(`.note-entry[data-id="${id}"]`);

  if (selectedNoteEl.classList.contains("selected-note")) return;

  removeSelectedClassFromAllNotes();

  selectedNoteEl.classList.add("selected-note");

  const notes = NotesAPI.getNotes();

  const selectedNote = notes.find((note) => note.id === Number(id));

  if (!selectedNote) return;

  const titleInputEl = document.getElementById("title-input");
  const contentInputEl = document.getElementById("content-input");

  titleInputEl.value = selectedNote.title;
  contentInputEl.value = selectedNote.content;

  const idStoreEl = document.getElementById("note-id-store");

  idStoreEl.setAttribute("data-id", id);
}

function removeSelectedClassFromAllNotes() {
  const noteEntries = document.querySelectorAll(".note-entry");

  noteEntries.forEach((noteEntry) => {
    noteEntry.classList.remove("selected-note");
  });
}

function newNote() {
  const titleInputEl = document.getElementById("title-input");
  const contentInputEl = document.getElementById("content-input");

  titleInputEl.value = "";
  contentInputEl.value = "";

  removeSelectedClassFromAllNotes();

  const idStoreEl = document.getElementById("note-id-store");

  idStoreEl.removeAttribute("data-id");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
