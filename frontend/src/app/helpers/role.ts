export function getUserRole(): 'admin' | 'manager' | null {
    const tokensStr = localStorage.getItem('tokens');
    if (!tokensStr) return null;

    try {
        const tokens = JSON.parse(tokensStr);
        const email = tokens?.email;
        if (!email) return null;
        return email === 'admin@gmail.com' ? 'admin' : tokens.email;
    } catch (err) {
        console.error('Помилка при отриманні токенів з localStorage:', err);
        return null;
    }
}
export function getCurrentManagerEmail(): string | null {
    const tokensStr = localStorage.getItem('tokens');
    if (!tokensStr) return null;

    try {
        const data = JSON.parse(tokensStr);
        console.log(data.email)
        return data?.email || null;

    } catch (err) {
        console.error('Помилка при отриманні поточного менеджера:', err);
        return null;
    }
}