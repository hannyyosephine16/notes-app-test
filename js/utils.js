// Utility functions

/**
 * Format tanggal ke format Indonesia
 * @param {Date|string} date - Tanggal yang akan diformat
 * @returns {string} Tanggal dalam format Indonesia
 */
const showFormattedDate = (date) => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };
    return new Date(date).toLocaleDateString("id-ID", options);
};

/**
 * Generate ID unik berdasarkan kombinasi timestamp dan random string
 * @returns {string} ID unik format string
 */
const generateId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${randomStr}-${timestamp}`;
};

/**
 * Truncate text jika terlalu panjang
 * @param {string} text - Teks yang akan dipotong
 * @param {number} maxLength - Panjang maksimum
 * @returns {string} Teks yang sudah dipotong
 */
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

/**
 * Escape HTML untuk mencegah XSS
 * @param {string} text - Teks yang akan di-escape
 * @returns {string} Teks yang sudah di-escape
 */
const escapeHtml = (text) => {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};