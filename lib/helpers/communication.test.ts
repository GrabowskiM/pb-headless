import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { syncFromPB, syncToPB } from './communication';

describe('syncToPB', () => {
    beforeEach(() => {
        vi.spyOn(window.parent, 'postMessage');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('sends a message to window.parent when it differs from window', () => {
        const originalParent = Object.getOwnPropertyDescriptor(window, 'parent');

        Object.defineProperty(window, 'parent', {
            value: { postMessage: vi.fn() },
            configurable: true,
        });

        syncToPB<{ foo: string }>('TEST_TYPE', { foo: 'bar' });

        expect(window.parent.postMessage).toHaveBeenCalledWith({ type: 'TEST_TYPE', data: { foo: 'bar' } }, '*');

        if (originalParent) {
            Object.defineProperty(window, 'parent', originalParent);
        }
    });

    it('sends a message without data when data is omitted', () => {
        Object.defineProperty(window, 'parent', {
            value: { postMessage: vi.fn() },
            configurable: true,
        });

        syncToPB('TEST_TYPE');

        expect(window.parent.postMessage).toHaveBeenCalledWith({ type: 'TEST_TYPE', data: undefined }, '*');
    });

    it('does not send a message when window.parent === window', () => {
        const postMessage = vi.spyOn(window, 'postMessage');

        syncToPB<{ foo: string }>('TEST_TYPE', { foo: 'bar' });

        expect(postMessage).not.toHaveBeenCalled();
    });
});

describe('syncFromPB', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('calls handler when event type matches', () => {
        const handler = vi.fn<(data: { value: number }) => void>();

        syncFromPB<{ value: number }>('MY_TYPE', handler);

        window.dispatchEvent(
            new MessageEvent('message', {
                data: { type: 'MY_TYPE', data: { value: 42 } },
            }),
        );

        expect(handler).toHaveBeenCalledWith({ value: 42 });
    });

    it('does not call handler when event type does not match', () => {
        const handler = vi.fn<(data: { value: number }) => void>();

        syncFromPB<{ value: number }>('MY_TYPE', handler);

        window.dispatchEvent(
            new MessageEvent('message', {
                data: { type: 'OTHER_TYPE', data: { value: 42 } },
            }),
        );

        expect(handler).not.toHaveBeenCalled();
    });

    it('passes listenerOptions to addEventListener', () => {
        const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
        const handler = vi.fn<(data: unknown) => void>();
        const options: AddEventListenerOptions = { once: true };

        syncFromPB<unknown>('MY_TYPE', handler, options);

        expect(addEventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function), options);
    });

    it('calls handler only once when listenerOptions.once is true', () => {
        const handler = vi.fn();

        syncFromPB('MY_TYPE', handler, { once: true });

        const event = new MessageEvent('message', {
            data: { type: 'MY_TYPE', data: null },
        });

        window.dispatchEvent(event);
        window.dispatchEvent(event);

        expect(handler).toHaveBeenCalledTimes(1);
    });

    it('returns a cleanup function that removes the listener', () => {
        const handler = vi.fn<(data: { value: number }) => void>();

        const cleanup = syncFromPB<{ value: number }>('MY_TYPE', handler);

        const event = new MessageEvent('message', {
            data: { type: 'MY_TYPE', data: { value: 1 } },
        });

        window.dispatchEvent(event);
        cleanup();
        window.dispatchEvent(event);

        expect(handler).toHaveBeenCalledTimes(1);
    });
});
