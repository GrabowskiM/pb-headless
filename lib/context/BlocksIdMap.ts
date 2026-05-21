import { createContext, useContext } from 'react';

export const BlocksIdMapContext = createContext(new Map());

export const useBlocksIdMap = () => useContext(BlocksIdMapContext);
