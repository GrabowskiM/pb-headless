export interface UpdateFieldDataMessage {
    fieldValue: unknown;
    blocksIdMap: Map<string, unknown>;
    blocksConfig: unknown[];
}

export interface InitModeMessage {
    blocksConfig: unknown[];
    blocksIdMap: Map<string, unknown>;
    fieldValue: unknown;
}

export interface DispatchEventMessage {
    eventName: string;
    eventDetail: unknown;
}
