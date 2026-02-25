import { Player } from "./player";

enum ResultType {
    STATUS = 'STATUS',
    SESSION = 'SESSION',
    ERROR = 'ERROR',
}

interface ErrorResult {
    message: string
}

interface SessionResult {
    id: string
    players?: Player[]
    nextPlayer?: Player
}

enum SessionStatus {
    INCOMPLETE = 'INCOMPLETE',
    OVER = 'OVER',
    BOARD = 'BOARD'
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

export {
    Result,
    ErrorResult,
    SessionResult,
    StatusResult,
    ResultType,
    SessionStatus
}