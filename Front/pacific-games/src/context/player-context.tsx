import { createContext, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from "react";
import { SessionKeys } from "../global";

type Player = {
    id?: string
    name?: string
}

const PlayerContext = createContext<[Player, Dispatch<SetStateAction<Player>>]>([{}, () => { }])

function PlayerProvider({ children }: PropsWithChildren) {
    const [player, setPlayer] = useState(getPlayerFromStorage());

    return (
        <PlayerContext.Provider value={[player, setPlayer]}>
            {children}
        </PlayerContext.Provider>
    )
}


function getPlayerFromStorage(): Player {
    const playerInfo: string = sessionStorage.getItem(SessionKeys.PLAYER_INFO) ?? '{}';
    return JSON.parse(playerInfo) as Player
}

export { PlayerProvider, PlayerContext, type Player }