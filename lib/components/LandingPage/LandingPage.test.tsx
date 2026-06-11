import { act, render, screen } from '@testing-library/react';
import { type ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { type InitModeMessage } from '../../types/PBMessages';
import { dispatchMessage } from '../../test-helpers';
import LandingPage from './LandingPage';

vi.mock('./LandingPagePBMode', () => ({
    default: ({ initData, children }: { initData?: InitModeMessage; children: ReactNode }) => (
        <div data-testid="landing-page-pb-mode" data-field-value={String(initData?.fieldValue)}>
            {children}
        </div>
    ),
}));

// --- Setup ---

let postMessageMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
    postMessageMock = vi.fn();
    Object.defineProperty(window, 'parent', { value: { postMessage: postMessageMock }, configurable: true });
});

afterEach(() => {
    Object.defineProperty(window, 'parent', { value: window, configurable: true });
    vi.restoreAllMocks();
});

// --- Tests ---

describe('LandingPage', () => {
    describe('non-PB mode', () => {
        it('renders children', () => {
            render(
                <LandingPage>
                    <div data-testid="child" />
                </LandingPage>,
            );

            expect(screen.getByTestId('child')).toBeDefined();
        });

        it('sends APP:INITIALIZED on mount', () => {
            render(
                <LandingPage>
                    <div />
                </LandingPage>,
            );

            expect(postMessageMock).toHaveBeenCalledWith({ type: 'APP:INITIALIZED', data: undefined }, '*');
        });
    });

    describe('PB mode', () => {
        it('renders LandingPagePBMode after receiving PB:INIT_MODE', () => {
            render(
                <LandingPage>
                    <div />
                </LandingPage>,
            );

            act(() => dispatchMessage('PB:INIT_MODE', undefined));

            expect(screen.getByTestId('landing-page-pb-mode')).toBeDefined();
        });

        it('passes initData from PB:INIT_MODE to LandingPagePBMode', () => {
            render(
                <LandingPage>
                    <div />
                </LandingPage>,
            );

            const initData: InitModeMessage = {
                fieldValue: 'foo',
                blocksConfig: [],
                blocksIdMap: new Map(),
            };

            act(() => dispatchMessage('PB:INIT_MODE', initData));

            expect(screen.getByTestId('landing-page-pb-mode').getAttribute('data-field-value')).toBe('foo');
        });

        it('renders children inside LandingPagePBMode', () => {
            render(
                <LandingPage>
                    <div data-testid="child" />
                </LandingPage>,
            );

            act(() => dispatchMessage('PB:INIT_MODE', undefined));

            expect(screen.getByTestId('child')).toBeDefined();
        });
    });
});
