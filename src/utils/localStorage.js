
const STORAGE_KEY = 'generator_surat_kuasa_history';

export const saveHistory = (data, label) => {
    try {
        const existing = getHistory();
        const newEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            label: label || `Surat Kuasa - ${data.pemberi.nama || 'Tanpa Nama'} (${new Date().toLocaleDateString()})`,
            data: data
        };
        const updated = [newEntry, ...existing];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage', error);
        return false;
    }
};

export const getHistory = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading from localStorage', error);
        return [];
    }
};

export const deleteHistory = (id) => {
    try {
        const existing = getHistory();
        const updated = existing.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return true;
    } catch (error) {
        console.error('Error deleting from localStorage', error);
        return false;
    }
};
