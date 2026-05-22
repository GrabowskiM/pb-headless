import { createContext } from 'react';

import { type FieldValue } from '../types/FieldValue';

export const FieldValueContext = createContext<FieldValue | undefined>(undefined);
