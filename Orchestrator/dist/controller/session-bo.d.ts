import Command from "../model/entities/command";
declare class SessionBO {
    static readonly instance: SessionBO;
    interpretCommand(command: Command): Promise<import("../model/entities").Result | {
        error: string;
    }>;
}
export default SessionBO;
//# sourceMappingURL=session-bo.d.ts.map