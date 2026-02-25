import { useContext, type PropsWithChildren } from "react";
import { PlayerContext } from "../../context/player-context";
import { Navigate, Route } from "react-router";
import { Paths } from "../DefaultRouter";

function PrivateRoute({ children, ...props }: PropsWithChildren & Record<string, unknown>) {
    const [player] = useContext(PlayerContext)

    if (!player?.id) {
        <Navigate to={Paths.ROOT} />
    }

    return (
        <Route {...props}>
            {children}
        </Route>
    )
}

export { PrivateRoute }