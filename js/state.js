// Global state management

// Inisialisasi notes dari data awal
let notes = getInitialData();
let searchQuery = '';

console.log('Initial notes loaded:', notes.length, 'notes');

// Membuat elemen HTML untuk catatan
function createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.className = 'note-card fade-in';
    noteElement.dataset.id = note.id;
    
    noteElement.innerHTML = `
        <div class="note-header">
            <h3 class="note-title">${escapeHtml(note.title)}</h3>
            <div class="note-date">📅 ${showFormattedDate(note.createdAt)}</div>
        </div>
        <div class="note-content">
            <p class="note-body">${escapeHtml(note.body)}</p>
        </div>
        <div class="note-actions">
            <button class="action-btn delete-btn" data-id="${note.id}">🗑️ Hapus</button>
            <button class="action-btn ${note.archived ? 'unarchive-btn' : 'archive-btn'}" data-id="${note.id}">
                ${note.archived ? '📤 Pindahkan' : '📦 Arsipkan'}
            </button>
        </div>
    `;
    
    return noteElement;
}

// Get filtered notes based on archive status and search query
function getFilteredNotes(isArchived = false) {
    return notes.filter(note => {
        const matchesArchiveStatus = note.archived === isArchived;
        const matchesSearch = searchQuery === '' || 
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.body.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesArchiveStatus && matchesSearch;
    });
}

// Add new note
function addNote(noteData) {
    const newNote = {
        id: `notes-${generateId()}`,
        title: noteData.title.trim(),
        body: noteData.body.trim(),
        createdAt: new Date().toISOString(),
        archived: false
    };
    
    notes.push(newNote);
    renderNotes();
    console.log('Note added, total notes:', notes.length);
    return newNote;
}

// Delete note by ID
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    renderNotes();
    console.log('Note deleted, ID:', id);
}

// Toggle archive status of a note
function toggleArchiveNote(id) {
    notes = notes.map(note => 
        note.id === id 
            ? { ...note, archived: !note.archived }
            : note
    );
    renderNotes();
    console.log('Note archive toggled, ID:', id);
}

// Update search query
function setSearchQuery(query) {
    searchQuery = query;
    renderNotes();
    console.log('Search query updated:', query);
}

// Render notes ke DOM
function renderNotes() {
    console.log('Rendering notes...');
    
    const activeNotesContainer = document.getElementById('active-notes');
    const archivedNotesContainer = document.getElementById('archived-notes');
    
    // Filter notes berdasarkan status arsip dan pencarian
    const activeNotes = getFilteredNotes(false);
    const archivedNotes = getFilteredNotes(true);
    
    console.log(`Found ${activeNotes.length} active notes and ${archivedNotes.length} archived notes`);
    
    // Bersihkan containers
    activeNotesContainer.innerHTML = '';
    archivedNotesContainer.innerHTML = '';
    
    // Render active notes
    if (activeNotes.length === 0) {
        activeNotesContainer.innerHTML = '<div class="empty-message">Tidak ada catatan aktif 📝</div>';
    } else {
        activeNotes.forEach(note => {
            activeNotesContainer.appendChild(createNoteElement(note));
        });
    }
    
    // Render archived notes
    if (archivedNotes.length === 0) {
        archivedNotesContainer.innerHTML = '<div class="empty-message">Tidak ada catatan arsip 📦</div>';
    } else {
        archivedNotes.forEach(note => {
            archivedNotesContainer.appendChild(createNoteElement(note));
        });
    }
    
    // Setup event listeners for buttons
    setupNoteButtonListeners();
}

// Setup event listeners for note action buttons
function setupNoteButtonListeners() {
    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const noteId = this.getAttribute('data-id');
            if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
                deleteNote(noteId);
            }
        });
    });
    
    // Archive/Unarchive buttons
    document.querySelectorAll('.archive-btn, .unarchive-btn').forEach(button => {
        button.addEventListener('click', function() {
            const noteId = this.getAttribute('data-id');
            toggleArchiveNote(noteId);
        });
    });
}