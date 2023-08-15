const saveButtonEl = document.querySelector(".save-note");
const deleteButtonEl = document.querySelector(".delete-note");
const newNoteButtonEl = document.querySelector(".create-new");
const notesListEl = document.querySelector(".notes-list");
const titleInputEl = document.getElementById("title-input");
const contentInputEl = document.getElementById("content-input");

saveButtonEl.addEventListener("click", clickSaveButton);
deleteButtonEl.addEventListener("click", clickDeleteButton);
newNoteButtonEl.addEventListener("click", newNote);

displayNotesList();
applyListeners();

function applyListeners() {
  const noteEntriesEls = document.querySelectorAll(".note-entry");

  noteEntriesEls.forEach((noteEntry) => {
    noteEntry.addEventListener("click", () =>
      selectNote(noteEntry.getAttribute("data-id"))
    );
  });
}

function displayNotesList() {
  const notes = getNotes();

  const sortedNotes = notes.sort(
    (noteA, noteB) => noteB.lastUpdated - noteA.lastUpdated
  );

  let html = "";

  // TODO: escape html for title and content <- UNBEDINGT INS TUTORIAL DEMONSTIEREN
  sortedNotes.forEach((note) => {
    html += `
            <div class="note-entry" data-id="${note.id}">
              <div class="note-title">${escapeHtml(note.title)}</div>
              <div class="note-content-teaser">${escapeHtml(note.content)}</div>
              <div class="note-date">${new Date(
                note.lastUpdated
              ).toLocaleString("de-DE")}</div>
            </div>`;
  });

  notesListEl.innerHTML = html;
}

function clickSaveButton() {
  const title = titleInputEl.value;
  const content = contentInputEl.value;

  if (!title || !content) {
    alert("Bitte Titel und Inhalt eingeben");
    return;
  }

  let currentId = undefined;

  const currentlySelectedNote = getCurrentlySelectedNote();

  if (currentlySelectedNote)
    currentId = currentlySelectedNote.getAttribute("data-id");

  saveNote(title, content, Number(currentId));

  titleInputEl.value = "";
  contentInputEl.value = "";

  displayNotesList();
  applyListeners();
}

function clickDeleteButton() {
  const currentlySelectedNote = getCurrentlySelectedNote();

  if (!currentlySelectedNote) return;

  const currentId = getCurrentlySelectedNote().getAttribute("data-id");

  if (!currentId) return;

  deleteNote(currentId);

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

  const notes = getNotes();

  const selectedNote = notes.find((note) => note.id === Number(id));

  if (!selectedNote) return;

  titleInputEl.value = selectedNote.title;
  contentInputEl.value = selectedNote.content;
}

function removeSelectedClassFromAllNotes() {
  const noteEntries = document.querySelectorAll(".note-entry");

  noteEntries.forEach((noteEntry) => {
    noteEntry.classList.remove("selected-note");
  });
}

function newNote() {
  titleInputEl.value = "";
  contentInputEl.value = "";

  removeSelectedClassFromAllNotes();
}

function getCurrentlySelectedNote() {
  return document.querySelector(".selected-note");
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
