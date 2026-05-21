import { createContext, useContext } from 'react';

export const BlocksConfigContext = createContext<unknown[]>([]);

export const useBlocksConfig = () => useContext(BlocksConfigContext);
