import { Navigate } from "react-router";
import { Paths } from "../DefaultRouter";
import { PlayerContext } from "../../context/player-context";
import { useContext, type PropsWithChildren } from "react";

function PrivateRoute({ children }: Readonly<PropsWithChildren>) {
    const [player] = useContext(PlayerContext)

    if (!player?.id) {
        return (
            <Navigate to={Paths.ROOT} />
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export { PrivateRoute }