import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { IsPBModeContext } from '../context/IsPBMode';
import useIsPBMode from './useIsPBMode';

const mockIframe = () => vi.spyOn(window, 'self', 'get').mockReturnValue({} as Window & typeof globalThis);

describe('useIsPBMode', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns true when inside an iframe and context is true', () => {
        mockIframe();

        const wrapper = ({ children }: { children: ReactNode }) => (
            <IsPBModeContext.Provider value={true}>{children}</IsPBModeContext.Provider>
        );

        const { result } = renderHook(() => useIsPBMode(), { wrapper });

        expect(result.current).toBe(true);
    });

    it('returns false when inside an iframe but context is false', () => {
        mockIframe();

        const wrapper = ({ children }: { children: ReactNode }) => (
            <IsPBModeContext.Provider value={false}>{children}</IsPBModeContext.Provider>
        );

        const { result } = renderHook(() => useIsPBMode(), { wrapper });

        expect(result.current).toBe(false);
    });

    it('returns false when not inside an iframe even if context is true', () => {
        const wrapper = ({ children }: { children: ReactNode }) => (
            <IsPBModeContext.Provider value={true}>{children}</IsPBModeContext.Provider>
        );

        const { result } = renderHook(() => useIsPBMode(), { wrapper });

        expect(result.current).toBe(false);
    });
});
