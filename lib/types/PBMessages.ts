import { type BlockConfig } from '../context/BlocksConfig';

export interface UpdateFieldDataMessage {
    fieldValue: unknown;
    blocksIdMap: Map<string, unknown>;
    blocksConfig: BlockConfig[];
}

export interface InitModeMessage {
    blocksConfig: BlockConfig[];
    blocksIdMap: Map<string, unknown>;
    fieldValue: unknown;
}

export interface DispatchEventMessage {
    eventName: string;
    eventDetail: unknown;
}
