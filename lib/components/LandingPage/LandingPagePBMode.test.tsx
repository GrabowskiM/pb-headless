import { act, render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BlocksConfigContext, type BlockConfig } from '../../context/BlocksConfig';
import { FieldValueContext } from '../../context/FieldValue';
import { type InitModeMessage, type UpdateFieldDataMessage } from '../../types/PBMessages';
import { dispatchMessage } from '../../test-helpers';
import LandingPagePBMode from './LandingPagePBMode';

const FieldValueConsumer = () => {
    const value = useContext(FieldValueContext);

    return <div data-testid="field-value">{JSON.stringify(value)}</div>;
};

const BlocksConfigConsumer = () => {
    const value = useContext(BlocksConfigContext);

    return <div data-testid="blocks-config">{JSON.stringify(value)}</div>;
};

const makeInitData = (overrides?: Partial<InitModeMessage>): InitModeMessage => ({
    fieldValue: null,
    blocksConfig: [],
    blocksIdMap: new Map(),
    ...overrides,
});

// --- Setup ---

let postMessageMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    postMessageMock = vi.fn();
    Object.defineProperty(window, 'parent', { value: { postMessage: postMessageMock }, configurable: true });
    vi.spyOn(window, 'scrollBy').mockImplementation(() => {});
});

afterEach(() => {
    Object.defineProperty(window, 'parent', { value: window, configurable: true });
    vi.restoreAllMocks();
});

// --- Tests ---

describe('LandingPagePBMode', () => {
    describe('rendering', () => {
        it('renders children', () => {
            render(
                <LandingPagePBMode>
                    <div data-testid="child" />
                </LandingPagePBMode>,
            );

            expect(screen.getByTestId('child')).toBeDefined();
        });
    });

    describe('initData', () => {
        it('initializes FieldValueContext from initData', () => {
            render(
                <LandingPagePBMode initData={makeInitData({ fieldValue: 'foo' })}>
                    <FieldValueConsumer />
                </LandingPagePBMode>,
            );

            expect(screen.getByTestId('field-value').textContent).toBe('"foo"');
        });

        it('initializes BlocksConfigContext from initData', () => {
            const blocksConfig: BlockConfig[] = [{ type: 'text', visible: true, attributes: [] }];

            render(
                <LandingPagePBMode initData={makeInitData({ blocksConfig })}>
                    <BlocksConfigConsumer />
                </LandingPagePBMode>,
            );

            expect(screen.getByTestId('blocks-config').textContent).toBe(JSON.stringify(blocksConfig));
        });
    });

    describe('PB:UPDATE_FIELD_DATA', () => {
        it('updates FieldValueContext', () => {
            render(
                <LandingPagePBMode>
                    <FieldValueConsumer />
                </LandingPagePBMode>,
            );

            const update: UpdateFieldDataMessage = {
                fieldValue: 'bar',
                blocksConfig: [],
                blocksIdMap: new Map(),
            };

            act(() => dispatchMessage('PB:UPDATE_FIELD_DATA', update));

            expect(screen.getByTestId('field-value').textContent).toBe('"bar"');
        });

        it('updates BlocksConfigContext', () => {
            render(
                <LandingPagePBMode>
                    <BlocksConfigConsumer />
                </LandingPagePBMode>,
            );

            const blocksConfig: BlockConfig[] = [{ type: 'embed', visible: true, attributes: [] }];
            const update: UpdateFieldDataMessage = { fieldValue: null, blocksConfig, blocksIdMap: new Map() };

            act(() => dispatchMessage('PB:UPDATE_FIELD_DATA', update));

            expect(screen.getByTestId('blocks-config').textContent).toBe(JSON.stringify(blocksConfig));
        });
    });

    describe('PB:SCROLL_BY', () => {
        it('calls window.scrollBy with the received data', () => {
            render(
                <LandingPagePBMode>
                    <div />
                </LandingPagePBMode>,
            );

            act(() => dispatchMessage('PB:SCROLL_BY', { top: 100, left: 0 }));

            expect(window.scrollBy).toHaveBeenCalledWith({ top: 100, left: 0 });
        });
    });

    describe('PB:DISPATCH_EVENT', () => {
        it('dispatches a custom event on document.body', () => {
            render(
                <LandingPagePBMode>
                    <div />
                </LandingPagePBMode>,
            );

            const listener = vi.fn();
            document.body.addEventListener('foo', listener);

            act(() => dispatchMessage('PB:DISPATCH_EVENT', { eventName: 'foo', eventDetail: { foo: 'bar' } }));

            expect(listener).toHaveBeenCalledOnce();
            expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({ foo: 'bar' });

            document.body.removeEventListener('foo', listener);
        });
    });

    describe('mousemove', () => {
        it('sends APP:MOUSE_POSITION with cursor coordinates', () => {
            render(
                <LandingPagePBMode>
                    <div />
                </LandingPagePBMode>,
            );

            act(() => window.dispatchEvent(new MouseEvent('mousemove', { clientX: 42, clientY: 17 })));

            expect(postMessageMock).toHaveBeenCalledWith({ type: 'APP:MOUSE_POSITION', data: { x: 42, y: 17 } }, '*');
        });
    });

    describe('scrollend', () => {
        it('sends APP:SCROLL_END', () => {
            render(
                <LandingPagePBMode>
                    <div />
                </LandingPagePBMode>,
            );

            act(() => window.dispatchEvent(new Event('scrollend')));

            expect(postMessageMock).toHaveBeenCalledWith({ type: 'APP:SCROLL_END', data: {} }, '*');
        });
    });

    describe('scroll', () => {
        it('does not trigger position update during programmatic scroll', () => {
            render(
                <LandingPagePBMode>
                    <div />
                </LandingPagePBMode>,
            );

            const rafSpy = vi.spyOn(window, 'requestAnimationFrame');
            postMessageMock.mockClear();
            rafSpy.mockClear();

            act(() => dispatchMessage('PB:SCROLL_BY', { top: 100 }));
            act(() => window.dispatchEvent(new Event('scroll')));

            expect(rafSpy).not.toHaveBeenCalled();
        });
    });

    describe('cleanup on unmount', () => {
        it('stops handling PB messages after unmount', () => {
            const { unmount } = render(
                <LandingPagePBMode>
                    <FieldValueConsumer />
                </LandingPagePBMode>,
            );

            unmount();

            act(() => dispatchMessage('PB:UPDATE_FIELD_DATA', { fieldValue: 'foo', blocksConfig: [], blocksIdMap: new Map() }));
            act(() => window.dispatchEvent(new MouseEvent('mousemove', { clientX: 1, clientY: 1 })));

            expect(postMessageMock).not.toHaveBeenCalledWith(expect.objectContaining({ type: 'APP:MOUSE_POSITION' }), '*');
        });
    });
});
