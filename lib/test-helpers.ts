import { type Block as BlockData, type Zone as ZoneData } from './types/FieldValue';

export const makeBlock = (overrides?: Partial<BlockData>): BlockData => ({
    id: 'foo',
    type: 'text',
    name: 'foo',
    view: 'default',
    visible: true,
    class: null,
    style: null,
    compiled: '',
    since: null,
    till: null,
    attributes: [],
    ...overrides,
});

export const makeZone = (overrides?: Partial<ZoneData>): ZoneData => ({
    id: 'foo',
    name: 'foo',
    blocks: [],
    ...overrides,
});

export const dispatchMessage = (type: string, data: unknown): void => {
    window.dispatchEvent(new MessageEvent('message', { data: { type, data } }));
};
