// Note Item Component
class NoteItem extends HTMLElement {
    constructor() {
        super();
        this.noteId = this.getAttribute('note-id') || '';
        this.noteTitle = this.getAttribute('note-title') || '';
        this.noteBody = this.getAttribute('note-body') || '';
        this.noteDate = this.getAttribute('note-date') || new Date().toISOString();
        this.noteArchived = this.getAttribute('note-archived') === 'true';
        
        this.render();
        this.setupEventListeners();
    }

    render() {
        // Generate a unique ID for this note (for aria-labelledby)
        const noteHeadingId = `note-heading-${this.noteId}`;
        const noteDateId = `note-date-${this.noteId}`;
        
        this.innerHTML = `
            <style>
                .note-card {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    border-radius: 15px;
                    padding: 20px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .note-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
                }
                
                .note-header {
                    margin-bottom: 15px;
                }
                
                .note-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: white;
                    margin-bottom: 8px;
                    line-height: 1.3;
                    word-wrap: break-word;
                }
                
                .note-date {
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.7);
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                
                .note-content {
                    flex: 1;
                    margin-bottom: 20px;
                }
                
                .note-body {
                    color: rgba(255, 255, 255, 0.9);
                    line-height: 1.6;
                    word-wrap: break-word;
                    white-space: pre-line;
                }
                
                .note-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: auto;
                }
                
                .action-btn {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 0.9rem;
                }
                
                .action-btn:focus {
                    outline: 3px solid #4ecdc4;
                    outline-offset: 2px;
                }
                
                .delete-btn {
                    background: linear-gradient(45deg, #ff6b6b, #ff5252);
                    color: white;
                }
                
                .delete-btn:hover {
                    background: linear-gradient(45deg, #ff5252, #ff1744);
                    transform: translateY(-2px);
                }
                
                .archive-btn {
                    background: linear-gradient(45deg, #4ecdc4, #45b7d1);
                    color: white;
                }
                
                .archive-btn:hover {
                    background: linear-gradient(45deg, #45b7d1, #2196f3);
                    transform: translateY(-2px);
                }
                
                .unarchive-btn {
                    background: linear-gradient(45deg, #ffa726, #ff9800);
                    color: white;
                }
                
                .unarchive-btn:hover {
                    background: linear-gradient(45deg, #ff9800, #f57c00);
                    transform: translateY(-2px);
                }
                
                /* Animation for note cards */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .note-card.animate {
                    animation: fadeIn 0.5s ease forwards;
                }
            </style>
            <article class="note-card" aria-labelledby="${noteHeadingId} ${noteDateId}">
                <header class="note-header">
                    <h3 id="${noteHeadingId}" class="note-title">${this.noteTitle}</h3>
                    <time id="${noteDateId}" class="note-date" datetime="${new Date(this.noteDate).toISOString()}">
                        <span aria-hidden="true">📅</span> ${showFormattedDate(this.noteDate)}
                    </time>
                </header>
                <div class="note-content">
                    <p class="note-body">${this.noteBody}</p>
                </div>
                <div class="note-actions">
                    <button class="action-btn delete-btn" aria-label="Hapus catatan ${this.noteTitle}">
                        <span aria-hidden="true">🗑️</span> Hapus
                    </button>
                    <button class="action-btn ${this.noteArchived ? 'unarchive-btn' : 'archive-btn'}" 
                            aria-label="${this.noteArchived ? 'Pindahkan catatan ' + this.noteTitle + ' dari arsip' : 'Arsipkan catatan ' + this.noteTitle}">
                        <span aria-hidden="true">${this.noteArchived ? '📤' : '📦'}</span> 
                        ${this.noteArchived ? 'Pindahkan' : 'Arsipkan'}
                    </button>
                </div>
            </article>
        `;

        // Apply animation after a small delay
        setTimeout(() => {
            const noteCard = this.querySelector('.note-card');
            if (noteCard) {
                noteCard.classList.add('animate');
            }
        }, 50);
    }
    
    setupEventListeners() {
        const deleteBtn = this.querySelector('.delete-btn');
        const archiveBtn = this.querySelector('.archive-btn, .unarchive-btn');
        
        deleteBtn.addEventListener('click', () => {
            if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
                NotesState.deleteNote(this.noteId);
            }
        });
        
        archiveBtn.addEventListener('click', () => {
            NotesState.toggleArchive(this.noteId);
        });

        // Keyboard accessibility
        [deleteBtn, archiveBtn].forEach(btn => {
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }

    // Handle attribute changes
    static get observedAttributes() {
        return ['note-id', 'note-title', 'note-body', 'note-date', 'note-archived'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            // Update properties
            if (name === 'note-id') this.noteId = newValue;
            if (name === 'note-title') this.noteTitle = newValue;
            if (name === 'note-body') this.noteBody = newValue;
            if (name === 'note-date') this.noteDate = newValue;
            if (name === 'note-archived') this.noteArchived = newValue === 'true';
            
            // Re-render component
            this.render();
            this.setupEventListeners();
        }
    }
}