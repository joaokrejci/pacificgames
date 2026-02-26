const API: Record<string, string> = {
    URL: import.meta.env.VITE_API_URL,
    registerPlayer: '/register-player',
    joinSession: '/join-session',
    game: '/game'
}

export { API }