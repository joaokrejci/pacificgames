import { createContext, useMemo, useState, type PropsWithChildren } from "react";
import { SessionKeys } from "../global";

type Player = {
    id: string
    name: string
}

type PlayerContextType = [Player | undefined, (player: Player) => void];

const PlayerContext = createContext<PlayerContextType>([undefined, () => {}])

function PlayerProvider({ children }: Readonly<PropsWithChildren>) {
    const [player, setPlayer] = useState(getPlayerFromStorage());
    const setPlayerWithStorage = (newPlayer: Player) => {
        console.log(newPlayer)
        setPlayer(newPlayer);
        sessionStorage.setItem(SessionKeys.PLAYER_INFO, JSON.stringify(newPlayer))
    }
    const playerContext = useMemo<PlayerContextType>(() => ([player, setPlayerWithStorage]), [player]);

    return (
        <PlayerContext.Provider value={playerContext}>
            {children}
        </PlayerContext.Provider>
    )
}


function getPlayerFromStorage(): Player {
    const playerInfo: string = sessionStorage.getItem(SessionKeys.PLAYER_INFO) ?? '{}';
    return JSON.parse(playerInfo) as Player
}

export { PlayerProvider, PlayerContext, type Player }