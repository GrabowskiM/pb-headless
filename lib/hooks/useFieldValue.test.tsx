import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { FieldValueContext } from '../context/FieldValue';
import useFieldValue from './useFieldValue';

describe('useFieldValue', () => {
    it('returns the value from the provider', () => {
        const value = { foo: 'bar' };
        const wrapper = ({ children }: { children: ReactNode }) => (
            <FieldValueContext.Provider value={value}>{children}</FieldValueContext.Provider>
        );

        const { result } = renderHook(() => useFieldValue(), { wrapper });

        expect(result.current).toBe(value);
    });
});
