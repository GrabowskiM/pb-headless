import { createContext, useContext } from 'react';

export interface BlockAttributeConfig {
    id: string;
    constraints?: Record<string, unknown> | unknown[];
}

export interface BlockConfig {
    type: string;
    visible: boolean;
    attributes: BlockAttributeConfig[];
}

export const BlocksConfigContext = createContext<BlockConfig[]>([]);

export const useBlocksConfig = () => useContext(BlocksConfigContext);
