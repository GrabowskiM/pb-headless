import { act, render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { FieldValueContext } from '../../context/FieldValue';
import { type FieldValue, type Zone as ZoneData } from '../../types/FieldValue';
import { dispatchMessage, makeBlock, makeZone } from '../../test-helpers';
import ZonePBMode from './ZonePBMode';

vi.mock('../Block', () => ({
    default: ({ block }: { block: { id: string } }) => <div data-testid={`block-${block.id}`} data-ibexa-block-id={block.id} />,
}));

vi.mock('./DroppablePlaceholder', () => ({
    default: () => <div data-testid="droppable-placeholder" />,
}));

// --- Helpers ---

const makeFieldValue = (zones: ZoneData[]): FieldValue => ({
    layout: 'default',
    zones,
});

const TestWrapper = ({ children, fieldValue }: { children: ReactNode; fieldValue?: FieldValue }) => (
    <FieldValueContext.Provider value={fieldValue}>{children}</FieldValueContext.Provider>
);

// --- Setup ---

let postMessageMock: ReturnType<typeof vi.fn>;
let elementFromPointMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    postMessageMock = vi.fn();
    Object.defineProperty(window, 'parent', { value: { postMessage: postMessageMock }, configurable: true });
    elementFromPointMock = vi.fn().mockReturnValue(null);
    Object.defineProperty(document, 'elementFromPoint', { value: elementFromPointMock, writable: true, configurable: true });
});

afterEach(() => {
    Object.defineProperty(window, 'parent', { value: window, configurable: true });
    vi.restoreAllMocks();
});

// --- Tests ---

describe('ZonePBMode', () => {
    describe('rendering', () => {
        it('renders zone wrapper with correct data attribute', () => {
            const { container } = render(
                <TestWrapper>
                    <ZonePBMode zone={makeZone()} />
                </TestWrapper>,
            );

            expect(container.firstElementChild?.getAttribute('data-ibexa-zone-id')).toBe('foo');
        });

        it('renders empty zone message when no blocks', () => {
            render(
                <TestWrapper>
                    <ZonePBMode zone={makeZone({ blocks: [] })} />
                </TestWrapper>,
            );

            expect(screen.getByText('Drop blocks here')).toBeDefined();
        });

        it('renders blocks when zone has blocks', () => {
            const zone = makeZone({ blocks: [makeBlock({ id: 'foo' }), makeBlock({ id: 'bar' })] });

            render(
                <TestWrapper>
                    <ZonePBMode zone={zone} />
                </TestWrapper>,
            );

            expect(screen.getByTestId('block-foo')).toBeDefined();
            expect(screen.getByTestId('block-bar')).toBeDefined();
        });

        it('renders zone number from FieldValue context', () => {
            const zone1 = makeZone({ id: 'foo', name: 'foo' });
            const zone2 = makeZone({ id: 'bar', name: 'bar' });
            const fieldValue = makeFieldValue([zone1, zone2]);

            render(
                <TestWrapper fieldValue={fieldValue}>
                    <ZonePBMode zone={zone2} />
                </TestWrapper>,
            );

            expect(screen.getByText('Drop zone 2')).toBeDefined();
        });

        it('adds dragover CSS class when dragging over zone', () => {
            const { container } = render(
                <TestWrapper>
                    <ZonePBMode zone={makeZone()} />
                </TestWrapper>,
            );

            elementFromPointMock.mockReturnValue(container.firstElementChild as Element);

            act(() => {
                dispatchMessage('PB:DRAG_OVER', { x: 0, y: 0 });
            });

            expect(container.firstElementChild?.classList.contains('m-page-builder__zone--dragover')).toBe(true);
        });

        it('removes dragover CSS class when dragging outside zone', () => {
            const { container } = render(
                <TestWrapper>
                    <ZonePBMode zone={makeZone()} />
                </TestWrapper>,
            );
            const el = container.firstElementChild as HTMLElement;

            elementFromPointMock.mockReturnValue(el);
            act(() => {
                dispatchMessage('PB:DRAG_OVER', { x: 0, y: 0 });
            });

            elementFromPointMock.mockReturnValue(null);
            act(() => {
                dispatchMessage('PB:DRAG_OVER', { x: 9999, y: 9999 });
            });

            expect(el.classList.contains('m-page-builder__zone--dragover')).toBe(false);
        });
    });

    describe('PB:DROP', () => {
        it('sends DROP_RESPONSE with zoneId and nextBlockId when placeholder is set', () => {
            const zone = makeZone({ id: 'foo', blocks: [makeBlock({ id: 'foo' }), makeBlock({ id: 'bar' })] });
            const { container } = render(
                <TestWrapper>
                    <ZonePBMode zone={zone} />
                </TestWrapper>,
            );

            elementFromPointMock.mockReturnValue(container.firstElementChild as Element);
            vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
                top: 100,
                height: 50,
                left: 0,
                right: 0,
                bottom: 150,
                width: 0,
                x: 0,
                y: 0,
                toJSON: () => {},
            });

            // Drag over — y=0 < top(100) + height(50)/2 → placeholder at index 0
            act(() => {
                dispatchMessage('PB:DRAG_OVER', { x: 0, y: 0 });
            });
            act(() => {
                dispatchMessage('PB:DROP', {});
            });

            expect(postMessageMock).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'DROP_RESPONSE', data: { zoneId: 'foo', nextBlockId: 'foo' } }),
                '*',
            );
        });

        it('sends DROP_RESPONSE with undefined nextBlockId when placeholder is at end', () => {
            const zone = makeZone({ id: 'foo', blocks: [makeBlock({ id: 'foo' })] });
            const { container } = render(
                <TestWrapper>
                    <ZonePBMode zone={zone} />
                </TestWrapper>,
            );

            elementFromPointMock.mockReturnValue(container.firstElementChild as Element);
            vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
                top: 0,
                height: 10,
                left: 0,
                right: 0,
                bottom: 10,
                width: 0,
                x: 0,
                y: 0,
                toJSON: () => {},
            });

            act(() => {
                dispatchMessage('PB:DRAG_OVER', { x: 0, y: 999 });
            });
            act(() => {
                dispatchMessage('PB:DROP', {});
            });

            expect(postMessageMock).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'DROP_RESPONSE', data: { zoneId: 'foo', nextBlockId: undefined } }),
                '*',
            );
        });

        it('does not send DROP_RESPONSE when placeholder is null', () => {
            render(
                <TestWrapper>
                    <ZonePBMode zone={makeZone({ blocks: [] })} />
                </TestWrapper>,
            );

            act(() => {
                dispatchMessage('PB:DROP', {});
            });

            expect(postMessageMock).not.toHaveBeenCalled();
        });

        it('clears placeholder and dragover state after drop', () => {
            const zone = makeZone({ id: 'foo', blocks: [makeBlock({ id: 'foo' })] });
            const { container } = render(
                <TestWrapper>
                    <ZonePBMode zone={zone} />
                </TestWrapper>,
            );

            elementFromPointMock.mockReturnValue(container.firstElementChild as Element);
            vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
                top: 100,
                height: 50,
                left: 0,
                right: 0,
                bottom: 150,
                width: 0,
                x: 0,
                y: 0,
                toJSON: () => {},
            });

            act(() => {
                dispatchMessage('PB:DRAG_OVER', { x: 0, y: 0 });
            });
            act(() => {
                dispatchMessage('PB:DROP', {});
            });

            expect(screen.queryByTestId('droppable-placeholder')).toBeNull();
            expect(container.firstElementChild?.classList.contains('m-page-builder__zone--dragover')).toBe(false);
        });
    });

    describe('PB:UPDATE_FIELD_DATA', () => {
        it('clears placeholder on PB:UPDATE_FIELD_DATA', () => {
            const zone = makeZone({ id: 'foo', blocks: [makeBlock({ id: 'foo' })] });
            const { container } = render(
                <TestWrapper>
                    <ZonePBMode zone={zone} />
                </TestWrapper>,
            );

            elementFromPointMock.mockReturnValue(container.firstElementChild as Element);
            vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
                top: 100,
                height: 50,
                left: 0,
                right: 0,
                bottom: 150,
                width: 0,
                x: 0,
                y: 0,
                toJSON: () => {},
            });

            act(() => {
                dispatchMessage('PB:DRAG_OVER', { x: 0, y: 0 });
            });
            expect(screen.queryByTestId('droppable-placeholder')).not.toBeNull();

            act(() => {
                dispatchMessage('PB:UPDATE_FIELD_DATA', {});
            });

            expect(screen.queryByTestId('droppable-placeholder')).toBeNull();
        });
    });

    describe('placeholder rendering', () => {
        it('renders placeholder before the block at the given index', () => {
            const zone = makeZone({ id: 'foo', blocks: [makeBlock({ id: 'foo' }), makeBlock({ id: 'bar' })] });
            const { container } = render(
                <TestWrapper>
                    <ZonePBMode zone={zone} />
                </TestWrapper>,
            );

            elementFromPointMock.mockReturnValue(container.firstElementChild as Element);
            // First block: top=100, height=50 → midpoint=125; y=0 < 125 → index 0
            vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
                top: 100,
                height: 50,
                left: 0,
                right: 0,
                bottom: 150,
                width: 0,
                x: 0,
                y: 0,
                toJSON: () => {},
            });

            act(() => {
                dispatchMessage('PB:DRAG_OVER', { x: 0, y: 0 });
            });

            expect(screen.getByTestId('block-foo').previousElementSibling).toBe(screen.getByTestId('droppable-placeholder'));
        });

        it('renders placeholder after all blocks when dragging to end', () => {
            const zone = makeZone({ id: 'foo', blocks: [makeBlock({ id: 'foo' }), makeBlock({ id: 'bar' })] });
            const { container } = render(
                <TestWrapper>
                    <ZonePBMode zone={zone} />
                </TestWrapper>,
            );

            elementFromPointMock.mockReturnValue(container.firstElementChild as Element);
            // y=999 > all midpoints → index = blocks.length
            vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
                top: 0,
                height: 10,
                left: 0,
                right: 0,
                bottom: 10,
                width: 0,
                x: 0,
                y: 0,
                toJSON: () => {},
            });

            act(() => {
                dispatchMessage('PB:DRAG_OVER', { x: 0, y: 999 });
            });

            expect(screen.getByTestId('block-bar').nextElementSibling).toBe(screen.getByTestId('droppable-placeholder'));
        });
    });
});
