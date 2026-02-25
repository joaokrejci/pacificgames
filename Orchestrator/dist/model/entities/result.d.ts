declare enum ResultType {
    STATUS = "STATUS",
    SESSION = "SESSION",
    ERROR = "ERROR"
}
interface ErrorResult {
    message: string;
}
interface SessionResult {
    id: string;
}
declare enum SessionStatus {
    INCOMPLETE = "INCOMPLETE",
    OVER = "OVER",
    BOARD = "BOARD"
}
interface StatusResult {
    status: string;
    info: number | string;
    nextPlayer?: string;
}
interface Result {
    type: string;
    data?: ErrorResult | SessionResult | StatusResult;
}
export { Result, ErrorResult, SessionResult, StatusResult, ResultType, SessionStatus };
//# sourceMappingURL=result.d.ts.map