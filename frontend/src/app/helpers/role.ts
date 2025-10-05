export function getUserRole(): 'admin' | 'manager' | null {
    const tokensStr = localStorage.getItem('tokens');
    if (!tokensStr) return null;

    try {
        const tokens = JSON.parse(tokensStr);
        const email = tokens?.email;
        if (!email) return null;

        return email === 'admin@gmail.com' ? 'admin' : 'manager';
    } catch (err) {
        console.error('Помилка при отриманні токенів з localStorage:', err);
        return null;
    }
}