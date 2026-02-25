import Command from './command';
import { Result } from './result';
declare class Server {
    private readonly host;
    private readonly port;
    private readonly type;
    private readonly timestamp;
    private socket;
    constructor(host: string, port: number, type: string, timestamp: Date);
    private open;
    sendCommand(command: Command): Promise<Result>;
    private formatCommand;
    private formatResult;
}
export { Server };
//# sourceMappingURL=server.d.ts.map