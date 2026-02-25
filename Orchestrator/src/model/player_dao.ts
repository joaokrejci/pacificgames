import { Player } from "./entities"

export default class PlayerDAO {
    static instance = new PlayerDAO()

    players: Record<string, Player> = {}

    insert(name: string) {
        const id = crypto.randomUUID()
        const player = { id, name }
        this.players[id] = player

        return player
    }

    get(id: string) {
        return this.players[id]
    }
}