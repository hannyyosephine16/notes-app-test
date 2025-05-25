// Main App Initialization

// Setup form
function setupForm() {
    const noteForm = document.getElementById('note-form');
    const titleInput = document.getElementById('title-input');
    const bodyInput = document.getElementById('body-input');
    const charCounter = document.getElementById('char-counter');
    const titleValidation = document.getElementById('title-validation');
    const bodyValidation = document.getElementById('body-validation');
    const maxTitleLength = 50;
    
    // Update character counter
    function updateCharCounter() {
        const remaining = maxTitleLength - titleInput.value.length;
        charCounter.textContent = `Sisa karakter: ${remaining}`;
        
        if (remaining < 10) {
            charCounter.className = 'char-counter warning';
        } else {
            charCounter.className = 'char-counter normal';
        }
    }
    
    // Validate title
    function validateTitle() {
        const title = titleInput.value.trim();
        
        if (title.length === 0) {
            titleValidation.textContent = 'Judul tidak boleh kosong';
            return false;
        } else if (title.length > maxTitleLength) {
            titleValidation.textContent = `Judul terlalu panjang (maksimal ${maxTitleLength} karakter)`;
            return false;
        } else {
            titleValidation.textContent = '';
            return true;
        }
    }
    
    // Validate body
    function validateBody() {
        const body = bodyInput.value.trim();
        
        if (body.length === 0) {
            bodyValidation.textContent = 'Isi catatan tidak boleh kosong';
            return false;
        } else {
            bodyValidation.textContent = '';
            return true;
        }
    }
    
    // Real-time validation
    titleInput.addEventListener('input', () => {
        validateTitle();
        updateCharCounter();
    });
    
    bodyInput.addEventListener('input', () => {
        validateBody();
    });
    
    // Form submission
    noteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isTitleValid = validateTitle();
        const isBodyValid = validateBody();
        
        if (isTitleValid && isBodyValid) {
            addNote({
                title: titleInput.value.trim(),
                body: bodyInput.value.trim()
            });
            
            // Reset form
            noteForm.reset();
            updateCharCounter();
            
            // Show success message
            const submitBtn = noteForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '✅ Berhasil Ditambahkan!';
            submitBtn.style.background = 'linear-gradient(45deg, #51cf66, #69db7c)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
            }, 2000);
        }
    });
    
    // Initial character counter
    updateCharCounter();
}

// Setup search
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener('input', (e) => {
        setSearchQuery(e.target.value);
    });
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('search-input').focus();
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('search-input');
            if (searchInput === document.activeElement) {
                searchInput.value = '';
                setSearchQuery('');
                searchInput.blur();
            }
        }
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    console.log(`Loaded ${notes.length} notes from data`);
    
    setupForm();
    setupSearch();
    setupKeyboardShortcuts();
    
    // Render notes with a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        renderNotes();
    }, 100);
    
    console.log('App initialized successfully');
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});