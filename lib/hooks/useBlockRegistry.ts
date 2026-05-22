import { useContext } from 'react';

import { BlockRegistryContext } from '../context/BlockRegistry';

const useBlockRegistry = () => useContext(BlockRegistryContext);

export default useBlockRegistry;
