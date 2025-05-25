// Note Form Component
class NoteForm extends HTMLElement {
    constructor() {
        super();
        this.maxTitleLength = parseInt(this.getAttribute('max-title-length')) || 50;
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
            <style>
                .form-container {
                    max-width: 600px;
                    margin: 0 auto;
                }
                
                .form-title {
                    font-size: 1.8rem;
                    text-align: center;
                    margin-bottom: 25px;
                    color: white;
                }
                
                .form-group {
                    margin-bottom: 20px;
                }
                
                .form-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                }
                
                .form-input,
                .form-textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 10px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    font-size: 1rem;
                    font-family: inherit;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }
                
                .form-input:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #4ecdc4;
                    box-shadow: 0 0 15px rgba(78, 205, 196, 0.3);
                }
                
                .form-input::placeholder,
                .form-textarea::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                }
                
                .form-textarea {
                    min-height: 120px;
                    resize: vertical;
                }
                
                .char-counter {
                    text-align: right;
                    font-size: 0.9rem;
                    margin-top: 5px;
                    transition: color 0.3s ease;
                }
                
                .char-counter.warning {
                    color: #ff6b6b;
                }
                
                .char-counter.normal {
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .submit-btn {
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }
                
                .submit-btn:focus {
                    outline: 3px solid #4ecdc4;
                    outline-offset: 2px;
                }
                
                .submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .validation-message {
                    color: #ff6b6b;
                    font-size: 0.9rem;
                    margin-top: 5px;
                    min-height: 20px;
                }
            </style>
            <div class="form-container">
                <h2 id="form-heading" class="form-title">✍️ Buat Catatan Baru</h2>
                <form class="note-form" aria-labelledby="form-heading">
                    <div class="form-group">
                        <label class="form-label" for="title-input">Judul Catatan</label>
                        <input 
                            type="text" 
                            id="title-input" 
                            class="form-input" 
                            placeholder="Masukkan judul catatan..." 
                            required
                            maxlength="${this.maxTitleLength}"
                            aria-describedby="title-validation char-counter"
                        >
                        <div id="char-counter" class="char-counter normal" aria-live="polite">Sisa karakter: ${this.maxTitleLength}</div>
                        <div id="title-validation" class="validation-message" aria-live="assertive"></div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="body-input">Isi Catatan</label>
                        <textarea 
                            id="body-input" 
                            class="form-textarea" 
                            placeholder="Tulis catatan Anda di sini..." 
                            required
                            aria-describedby="body-validation"
                        ></textarea>
                        <div id="body-validation" class="validation-message" aria-live="assertive"></div>
                    </div>
                    
                    <button type="submit" class="submit-btn">Tambah Catatan</button>
                </form>
            </div>
        `;
    }

    setupEventListeners() {
        this.titleInput = this.querySelector('#title-input');
        this.bodyInput = this.querySelector('#body-input');
        this.charCounter = this.querySelector('.char-counter');
        this.form = this.querySelector('.note-form');
        this.submitBtn = this.querySelector('.submit-btn');
        
        // Real-time validation for title
        this.titleInput.addEventListener('input', () => {
            this.validateTitle();
            this.updateCharCounter();
        });
        
        // Real-time validation for body
        this.bodyInput.addEventListener('input', () => {
            this.validateBody();
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Keyboard accessibility
        this.submitBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.submitBtn.click();
            }
        });
    }
    
    validateTitle() {
        const titleValidation = this.querySelector('#title-validation');
        const title = this.titleInput.value.trim();
        
        if (title.length === 0) {
            titleValidation.textContent = 'Judul tidak boleh kosong';
            this.titleInput.setAttribute('aria-invalid', 'true');
            return false;
        } else if (title.length > this.maxTitleLength) {
            titleValidation.textContent = `Judul terlalu panjang (maksimal ${this.maxTitleLength} karakter)`;
            this.titleInput.setAttribute('aria-invalid', 'true');
            return false;
        } else {
            titleValidation.textContent = '';
            this.titleInput.removeAttribute('aria-invalid');
            return true;
        }
    }
    
    validateBody() {
        const bodyValidation = this.querySelector('#body-validation');
        const body = this.bodyInput.value.trim();
        
        if (body.length === 0) {
            bodyValidation.textContent = 'Isi catatan tidak boleh kosong';
            this.bodyInput.setAttribute('aria-invalid', 'true');
            return false;
        } else {
            bodyValidation.textContent = '';
            this.bodyInput.removeAttribute('aria-invalid');
            return true;
        }
    }
    
    updateCharCounter() {
        const remaining = this.maxTitleLength - this.titleInput.value.length;
        this.charCounter.textContent = `Sisa karakter: ${remaining}`;
        
        if (remaining < 10) {
            this.charCounter.className = 'char-counter warning';
        } else {
            this.charCounter.className = 'char-counter normal';
        }
    }
    
    handleSubmit() {
        const isTitleValid = this.validateTitle();
        const isBodyValid = this.validateBody();
        
        if (isTitleValid && isBodyValid) {
            const noteData = {
                title: this.titleInput.value.trim(),
                body: this.bodyInput.value.trim()
            };
            
            NotesState.addNote(noteData);
            this.resetForm();
            this.showSuccessMessage();
        }
    }
    
    resetForm() {
        this.titleInput.value = '';
        this.bodyInput.value = '';
        this.updateCharCounter();
        this.querySelector('#title-validation').textContent = '';
        this.querySelector('#body-validation').textContent = '';
    }
    
    showSuccessMessage() {
        const originalText = this.submitBtn.textContent;
        this.submitBtn.textContent = '✅ Berhasil Ditambahkan!';
        this.submitBtn.style.background = 'linear-gradient(45deg, #51cf66, #69db7c)';
        
        setTimeout(() => {
            this.submitBtn.textContent = originalText;
            this.submitBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
        }, 2000);
    }

    // Handle attribute changes
    static get observedAttributes() {
        return ['max-title-length'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'max-title-length') {
            this.maxTitleLength = parseInt(newValue) || 50;
            if (this.charCounter) {
                this.updateCharCounter();
            }
        }
    }
}