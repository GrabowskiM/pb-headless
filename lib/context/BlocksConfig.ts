import { createContext, useContext } from 'react';

export const BlocksConfigContext = createContext(new Map());

export const useBlocksConfig = () => useContext(BlocksConfigContext);
