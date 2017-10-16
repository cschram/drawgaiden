export function getSessionItem(name: string) {
    if (window.sessionStorage) {
        return sessionStorage.getItem(name);
    }
    return null;
}

export function setSessionItem(name: string, value: string) {
    if (window.sessionStorage) {
        sessionStorage.setItem(name, value);
    }
}

export function removeSessionItem(name: string) {
    if (window.sessionStorage) {
        sessionStorage.removeItem(name);
    }
}