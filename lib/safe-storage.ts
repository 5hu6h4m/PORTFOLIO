export const safeStorage = {
    getItem: (key: string) => {
        try {
            if (typeof window !== 'undefined') {
                return localStorage.getItem(key);
            }
        } catch (e) {
            console.warn('localStorage access denied:', e);
        }
        return null;
    },
    setItem: (key: string, value: string) => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.warn('localStorage access denied:', e);
        }
    },
    removeItem: (key: string) => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(key);
            }
        } catch (e) {
            console.warn('localStorage access denied:', e);
        }
    }
};
