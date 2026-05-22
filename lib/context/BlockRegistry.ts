import { type ComponentType, createContext, type ReactNode, type RefObject } from 'react';

import { type Block, type BlockAttribute } from '../types/FieldValue';

export interface BlockComponentProps {
    data: BlockAttribute[];
}

export interface BlockRegistry {
    components: Record<string, ComponentType<BlockComponentProps>>;
    fallback?: (block: Block) => ReactNode;
}

export const BlockRegistryContext = createContext<RefObject<BlockRegistry> | null>(null);
