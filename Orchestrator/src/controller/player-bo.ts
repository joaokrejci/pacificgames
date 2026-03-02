import PlayerDAO from "../model/player_dao";

export default class PlayerBO {
    static instance = new PlayerBO()

    insert(name: string) {
        return PlayerDAO.instance.insert(name)
    }

    get(id: string) {
        return PlayerDAO.instance.get(id)
    }
}