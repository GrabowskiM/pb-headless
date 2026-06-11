import { render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { IsPBModeContext } from '../../context/IsPBMode';
import { type Block as BlockData } from '../../types/FieldValue';
import { makeBlock, makeZone } from '../../test-helpers';
import Zone from './Zone';

vi.mock('./ZonePBMode', () => ({
    default: ({ zone }: { zone: { id: string } }) => <div data-testid={`zone-pb-mode-${zone.id}`} />,
}));

vi.mock('../Block', () => ({
    default: ({ block }: { block: BlockData }) => <div data-testid={`block-${block.id}`} />,
}));

const TestWrapper = ({ children, isPBMode = false }: { children: ReactNode; isPBMode?: boolean }) => (
    <IsPBModeContext.Provider value={isPBMode}>{children}</IsPBModeContext.Provider>
);

// --- Tests ---

describe('Zone', () => {
    describe('non-PB mode', () => {
        it('renders a Block for each block in the zone', () => {
            const zone = makeZone({ blocks: [makeBlock({ id: 'foo' }), makeBlock({ id: 'bar' })] });

            render(
                <TestWrapper>
                    <Zone zone={zone} />
                </TestWrapper>,
            );

            expect(screen.getByTestId('block-foo')).toBeDefined();
            expect(screen.getByTestId('block-bar')).toBeDefined();
        });

        it('renders nothing when zone has no blocks', () => {
            const { container } = render(
                <TestWrapper>
                    <Zone zone={makeZone()} />
                </TestWrapper>,
            );

            expect(container.firstChild).toBeNull();
        });
    });

    describe('PB mode', () => {
        it('renders ZonePBMode instead of blocks', () => {
            render(
                <TestWrapper isPBMode>
                    <Zone zone={makeZone()} />
                </TestWrapper>,
            );

            expect(screen.getByTestId('zone-pb-mode-foo')).toBeDefined();
        });
    });
});
