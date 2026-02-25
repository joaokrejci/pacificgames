import { createContext, useState, type PropsWithChildren } from "react";
import { SessionKeys } from "../global";

type Session = {
    id?: string
    name?: string
}


function SessionProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState(getSessionFromStorage());
    const SessionInfoContext = createContext({})

    return (
        <SessionInfoContext.Provider value={[session, setSession]}>
            {children}
        </SessionInfoContext.Provider>
    )
}

export { SessionProvider, type Session }

function getSessionFromStorage(): Session {
    const SessionInfo: string = sessionStorage.getItem(SessionKeys.SESSION_INFO) ?? '{}';
    return JSON.parse(SessionInfo) as Session
}
