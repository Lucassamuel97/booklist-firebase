import { collection, query, where, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { useEffect, useState } from 'react';

function Notes({ bookId }) {

  const handleEraseNote = async (id) => {
    if (confirm('Are you sure you want to erase this note?')) {
      try {
        await deleteDoc(doc(db, "notes", id));
        setNotes(notes.filter(note => note.id !== id));
      } catch (error) {
        console.error("Error erasing note: ", error);
      }
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault();

    const newNote = {
      book_id: bookId,
      title: document.querySelector('input[name=title]').value,
      text: document.querySelector('textarea[name=note]').value
    }
    if (newNote.title && newNote.text) {
      try {
        const docRef = await addDoc(collection(db, "notes"), newNote);
        newNote.id = docRef.id;
        setNotes([...notes, newNote]);
        document.querySelector('input[name=title]').value = "";
        document.querySelector('textarea[name=note]').value = "";
      } catch (error) {
        alert('There was an error adding the note. Please try again later.');
      }
    } else {
      alert('Please fill the mandatory fields.');
    }
  }
  const fetchNotes = async (book_id) => {
    setfetchStatus('loading');
    try {
      const notesRef = query(collection(db, "notes"), where("book_id", "==", book_id));
      const notesSnap = await getDocs(notesRef);
      let notesList = [];
      notesSnap.forEach((doc) => {
        notesList.push({ ...doc.data(), id: doc.id });
      });
      setNotes(notesList);
      setfetchStatus('success');
    } catch (error) {
      console.error("Error fetching book: ", error);
      setfetchStatus('error');
    }
  }

  const [notes, setNotes] = useState("");
  const [fetchStatus, setfetchStatus] = useState("idle");

  useEffect(() => {
    if (fetchStatus == 'idle') {
      fetchNotes(bookId);
    }
  }, []);

  return (
    <>

      <div className="notes-wrapper">

        <h2>Reader's Notes</h2>

        {notes.length ?

          <div className="notes">
            {notes.map(note =>
              <div key={note.id} className="note">
                <div onClick={() => handleEraseNote(note.id)} className="erase-note">Erase note</div>
                <h3>{note.title}</h3>
                <p>{note.text}</p>
              </div>
            )}
          </div>

          : fetchStatus == 'success' ?
            <div>
              <p>This books doesn't have notes yet. Use the form below to add a note.</p>
            </div>
            : fetchStatus == 'error' ?
              <div>
                <p>There was an error fetching the notes. Please try again later.</p>
              </div>
              :
              <div>
                <p>Loading...</p>
              </div>
        }

        <details>
          <summary>Add a note</summary>
          <form className="add-note">
            <div className="form-control">
              <label>Title *</label>
              <input type="text" name="title" placeholder="Add a note title" />
            </div>
            <div className="form-control">
              <label>Note *</label>
              <textarea type="text" name="note" placeholder="Add note" />
            </div>

            <button onClick={(e) => { handleAddNote(e) }} className="btn btn-block">Add Note</button>
          </form>
        </details>

      </div>

    </>
  )
}

export default Notes
