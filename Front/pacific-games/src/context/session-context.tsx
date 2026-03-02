import { createContext, useMemo, useState, type PropsWithChildren } from "react";
import { SessionKeys } from "../global";
import type { Player } from "./player-context";

type Session = {
    id?: string
    name?: string,
    players?: Player[],
    nextPlayer?: Player,
    game?: string
}

type SessionContextType = [Session, (session: Session) => void]
const SessionContext = createContext<SessionContextType>([{}, () => { }])

function SessionProvider({ children }: Readonly<PropsWithChildren>) {
    const [session, setSession] = useState(getSessionFromStorage());
    const setSessionWithStorage = (newState: Session) => {
        setSession(newState);
        sessionStorage.setItem(SessionKeys.SESSION_INFO, JSON.stringify(newState))
    }
    const sessionContextValue = useMemo<SessionContextType>(() => [session, setSessionWithStorage], [session]);

    return (
        <SessionContext.Provider value={sessionContextValue}>
            {children}
        </SessionContext.Provider>
    )
}


function getSessionFromStorage(): Session {
    const SessionInfo: string = sessionStorage.getItem(SessionKeys.SESSION_INFO) ?? '{}';
    return JSON.parse(SessionInfo) as Session
}

export { SessionProvider, SessionContext, type Session }
