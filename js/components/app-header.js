// App Header Component
class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.innerHTML = `
            <style>
                .header-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 20px;
                }
                
                .header-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-align: center;
                }
                
                .search-container {
                    position: relative;
                    width: 100%;
                    max-width: 400px;
                }
                
                .search-input {
                    width: 100%;
                    padding: 12px 20px 12px 50px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 25px;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    font-size: 1rem;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }
                
                .search-input:focus {
                    outline: none;
                    border-color: #4ecdc4;
                    box-shadow: 0 0 20px rgba(78, 205, 196, 0.3);
                }
                
                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }
                
                .search-icon {
                    position: absolute;
                    left: 18px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 1.2rem;
                    color: rgba(255, 255, 255, 0.7);
                }
                
                @media (max-width: 768px) {
                    .header-title {
                        font-size: 2rem;
                    }
                    
                    .search-container {
                        max-width: 100%;
                    }
                }
            </style>
            <div class="header-content">
                <h1 class="header-title">📝 Aplikasi Catatan</h1>
                <div class="search-container">
                    <div class="search-icon">🔍</div>
                    <input type="text" class="search-input" placeholder="${this.getAttribute('search-placeholder') || 'Cari catatan...'}" aria-label="Cari catatan">
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        this.searchInput = this.querySelector('.search-input');
        this.searchInput.addEventListener('input', (e) => {
            NotesState.setSearchQuery(e.target.value);
        });
    }

    // Called when custom attributes change
    static get observedAttributes() {
        return ['search-placeholder'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'search-placeholder' && this.searchInput) {
            this.searchInput.placeholder = newValue;
        }
    }
}