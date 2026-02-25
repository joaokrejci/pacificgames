export default ServerDAO;
declare class ServerDAO {
    static instance: ServerDAO;
    servers: {};
    touch(config: any): void;
    getServer(type: any): any;
}
//# sourceMappingURL=server_dao.d.ts.map