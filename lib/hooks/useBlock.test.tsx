import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { BlockRegistryContext, type BlockComponentProps, type BlockRegistry } from '../context/BlockRegistry';
import { makeBlock } from '../test-helpers';
import { type Block as BlockData } from '../types/FieldValue';
import useBlock from './useBlock';

const makeRegistryRef = (overrides?: Partial<BlockRegistry>): { current: BlockRegistry } => ({
    current: { components: {}, ...overrides },
});

const TestComponent = ({ block }: { block: BlockData }) => <>{useBlock(block)}</>;

const TestWrapper = ({ children, registry }: { children: ReactNode; registry?: Partial<BlockRegistry> }) => (
    <BlockRegistryContext.Provider value={makeRegistryRef(registry)}>{children}</BlockRegistryContext.Provider>
);

// --- Tests ---

describe('useBlock', () => {
    it('returns the registered BlockComponent', () => {
        const BlockComponent = ({ data }: BlockComponentProps) => <div data-testid="block-component" data-count={data.length} />;
        const block = makeBlock({ attributes: [{ id: 'foo', name: 'title', value: 'foo' }] });

        render(
            <TestWrapper registry={{ components: { text: BlockComponent } }}>
                <TestComponent block={block} />
            </TestWrapper>,
        );

        expect(screen.getByTestId('block-component')).toBeDefined();
    });

    it('calls fallback and renders its output when block type is not in registry', () => {
        const fallback = vi.fn(() => <div data-testid="fallback" />);
        const block = makeBlock({ type: 'unknown' });

        render(
            <TestWrapper registry={{ components: {}, fallback }}>
                <TestComponent block={block} />
            </TestWrapper>,
        );

        expect(fallback).toHaveBeenCalledWith(block);
        expect(screen.getByTestId('fallback')).toBeDefined();
    });

    it('renders FallbackBlock when block type is not in registry and there is no fallback', () => {
        const block = makeBlock({ type: 'unknown', name: 'foo' });

        render(
            <TestWrapper registry={{ components: {} }}>
                <TestComponent block={block} />
            </TestWrapper>,
        );

        expect(screen.getByText('Unknown block type: unknown')).toBeDefined();
        expect(screen.getByText('Block name: foo')).toBeDefined();
    });
});
