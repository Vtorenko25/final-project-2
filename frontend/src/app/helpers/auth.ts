export const isAuth = (): boolean => {
    const tokens = localStorage.getItem('tokens');
    return !!tokens;
};