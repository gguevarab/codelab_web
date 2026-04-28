export enum BusinessError {
    NOT_FOUND,
    PRECONDITION_FAILED,
    BAD_REQUEST
}

export function BusinessLogicException(message: string, type: number) {
    this.message = message;
    this.type = type;
}
