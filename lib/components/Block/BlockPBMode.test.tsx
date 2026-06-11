import { act, fireEvent, render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BlocksConfigContext, type BlockConfig } from '../../context/BlocksConfig';
import { dispatchMessage, makeBlock } from '../../test-helpers';
import BlockPBMode from './BlockPBMode';

vi.mock('../../hooks/useBlock', () => ({
    default: () => <div data-testid="block-content" />,
}));

const TestWrapper = ({ children, blocksConfig = [] }: { children: ReactNode; blocksConfig?: BlockConfig[] }) => (
    <BlocksConfigContext.Provider value={blocksConfig}>{children}</BlocksConfigContext.Provider>
);

// --- Setup ---

let postMessageMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    postMessageMock = vi.fn();
    Object.defineProperty(window, 'parent', { value: { postMessage: postMessageMock }, configurable: true });
    HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
    Object.defineProperty(window, 'parent', { value: window, configurable: true });
    delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView;
    vi.restoreAllMocks();
});

// --- Tests ---

describe('BlockPBMode', () => {
    describe('rendering', () => {
        it('sets data-ibexa-block-id on the root element', () => {
            const block = makeBlock();

            const { container } = render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            expect((container.firstElementChild as HTMLElement).dataset.ibexaBlockId).toBe('foo');
        });

        it('renders invalid attributes list when required attributes are blank', () => {
            const block = makeBlock({ attributes: [{ id: 'foo', name: 'title', value: '' }] });
            const blocksConfig: BlockConfig[] = [
                { type: 'text', visible: true, attributes: [{ id: 'title', constraints: { not_blank: true } }] },
            ];

            render(
                <TestWrapper blocksConfig={blocksConfig}>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            expect(screen.getByRole('list')).toBeDefined();
        });

        it('does not render invalid attributes list when all required attributes have values', () => {
            const block = makeBlock({ attributes: [{ id: 'foo', name: 'title', value: 'foo' }] });
            const blocksConfig: BlockConfig[] = [
                { type: 'text', visible: true, attributes: [{ id: 'title', constraints: { not_blank: true } }] },
            ];

            render(
                <TestWrapper blocksConfig={blocksConfig}>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            expect(screen.queryByRole('list')).toBeNull();
        });
    });

    describe('click', () => {
        it('sends PB:BLOCK_CLICKED with blockId when the block is clicked', () => {
            const block = makeBlock({ id: 'foo' });

            const { container } = render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            fireEvent.click(container.firstElementChild as HTMLElement);

            expect(postMessageMock).toHaveBeenCalledWith({ type: 'PB:BLOCK_CLICKED', data: { blockId: 'foo' } }, '*');
        });
    });

    describe('PB:SCROLL_INTO_BLOCK', () => {
        it('calls scrollIntoView when blockId matches', () => {
            const block = makeBlock();

            render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            act(() => dispatchMessage('PB:SCROLL_INTO_BLOCK', { blockId: 'foo' }));

            expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
        });

        it('does not call scrollIntoView when blockId does not match', () => {
            const block = makeBlock();

            render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            act(() => dispatchMessage('PB:SCROLL_INTO_BLOCK', { blockId: 'other-block' }));

            expect(HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();
        });
    });

    describe('PB:BLOCK_REMOVE', () => {
        it('adds is-removing class when blockId matches', () => {
            const block = makeBlock();

            const { container } = render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            act(() => dispatchMessage('PB:BLOCK_REMOVE', { blockId: 'foo' }));

            expect((container.firstElementChild as HTMLElement).classList.contains('c-pb-block-preview--is-removing')).toBe(true);
        });

        it('does not add is-removing class when blockId does not match', () => {
            const block = makeBlock();

            const { container } = render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            act(() => dispatchMessage('PB:BLOCK_REMOVE', { blockId: 'other-block' }));

            expect((container.firstElementChild as HTMLElement).classList.contains('c-pb-block-preview--is-removing')).toBe(false);
        });
    });

    describe('PB:DRAG_START_PREVIEW and PB:DROP', () => {
        it('sets draggable when blockId matches', () => {
            const block = makeBlock();

            const { container } = render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            act(() => dispatchMessage('PB:DRAG_START_PREVIEW', { blockId: 'foo' }));

            const el = container.firstElementChild as HTMLElement;

            expect(el.getAttribute('draggable')).toBe('true');
        });

        it('does not set draggable when blockId does not match', () => {
            const block = makeBlock();

            const { container } = render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            act(() => dispatchMessage('PB:DRAG_START_PREVIEW', { blockId: 'other-block' }));

            expect((container.firstElementChild as HTMLElement).getAttribute('draggable')).not.toBe('true');
        });

        it('clears dragging state on PB:DROP', () => {
            const block = makeBlock();

            const { container } = render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            act(() => dispatchMessage('PB:DRAG_START_PREVIEW', { blockId: 'foo' }));
            act(() => dispatchMessage('PB:DROP', {}));

            expect((container.firstElementChild as HTMLElement).getAttribute('draggable')).not.toBe('true');
        });
    });

    describe('onAnimationEnd', () => {
        it('sends APP:BLOCK_REMOVE_RESPONSE when remove-field animation ends', () => {
            const block = makeBlock();

            const { container } = render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            fireEvent(
                container.firstElementChild as HTMLElement,
                new AnimationEvent('animationend', { animationName: 'remove-field', bubbles: true }),
            );

            expect(postMessageMock).toHaveBeenCalledWith({ type: 'APP:BLOCK_REMOVE_RESPONSE', data: { blockId: 'foo' } }, '*');
        });

        it('does not send APP:BLOCK_REMOVE_RESPONSE for other animation names', () => {
            const block = makeBlock();

            const { container } = render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            fireEvent(
                container.firstElementChild as HTMLElement,
                new AnimationEvent('animationend', { animationName: 'fade-in', bubbles: true }),
            );

            expect(postMessageMock).not.toHaveBeenCalled();
        });
    });

    describe('cleanup on unmount', () => {
        it('stops handling messages after unmount', () => {
            const block = makeBlock();

            const { unmount } = render(
                <TestWrapper>
                    <BlockPBMode block={block} />
                </TestWrapper>,
            );

            unmount();

            act(() => dispatchMessage('PB:SCROLL_INTO_BLOCK', { blockId: 'foo' }));

            expect(HTMLElement.prototype.scrollIntoView).not.toHaveBeenCalled();
        });
    });
});
