const LOCAL_STORAGE_KEY = "notizapp-notizen";

class NotesAPI {
  static getNotes() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
  }

  static getNextId() {
    const notes = this.getNotes();

    const sortedNotes = notes.sort((noteA, noteB) => noteA.id - noteB.id);

    let nextId = 1;

    for (let note of sortedNotes) {
      if (nextId < note.id) break;

      nextId = note.id + 1;
    }

    return nextId;
  }

  static saveNote(title, content, id = undefined) {
    const notes = this.getNotes();

    if (!id) {
      notes.push({
        title,
        content,
        id: this.getNextId(),
        lastUpdated: new Date().getTime(),
      });
    } else {
      const indexOfNoteWithId = notes.findIndex((note) => note.id === id);

      if (indexOfNoteWithId > -1) {
        notes[indexOfNoteWithId] = {
          title,
          content,
          id,
          lastUpdated: new Date().getTime(),
        };
      }
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }
}
