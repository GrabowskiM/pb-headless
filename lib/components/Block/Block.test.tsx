import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IsPBModeContext } from '../../context/IsPBMode';
import { makeBlock } from '../../test-helpers';
import Block from './Block';

vi.mock('./BlockPBMode', () => ({
    default: ({ block }: { block: { id: string } }) => <div data-testid={`block-pb-mode-${block.id}`} />,
}));

vi.mock('../../hooks/useBlock', () => ({
    default: () => <div data-testid="block-content" />,
}));

const TestWrapper = ({ children, isPBMode = false }: { children: ReactNode; isPBMode?: boolean }) => (
    <IsPBModeContext.Provider value={isPBMode}>{children}</IsPBModeContext.Provider>
);

// --- Tests ---

describe('Block', () => {
    describe('non-PB mode', () => {
        it('renders the content returned by useBlock', () => {
            render(
                <TestWrapper>
                    <Block block={makeBlock()} />
                </TestWrapper>,
            );

            expect(screen.getByTestId('block-content')).toBeDefined();
        });
    });

    describe('PB mode', () => {
        it('renders BlockPBMode instead of useBlock content', () => {
            render(
                <TestWrapper isPBMode>
                    <Block block={makeBlock()} />
                </TestWrapper>,
            );

            expect(screen.getByTestId('block-pb-mode-foo')).toBeDefined();
        });
    });
});
