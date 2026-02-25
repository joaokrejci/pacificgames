class ServerDAO {
    servers = {}

    static instance = new ServerDAO()

    touch(config) {
        setTimeout(
            () => delete this.servers[`${config.host}:${config.port}`],
            60000
        )
        this.servers[`${config.host}:${config.port}`] = config
    }

    getServer(type) {
        const typeServers = Object.values(this.servers).filter(({ type: serverType }) => type == serverType)
        return typeServers[0]
    }
}

export default ServerDAO