import { type ReactNode } from 'react';

import FallbackBlock from '../components/FallbackBlock/FallbackBlock';
import { type Block as BlockData } from '../types/FieldValue';
import useBlockRegistry from './useBlockRegistry';

const useBlock = (block: BlockData): ReactNode => {
    const registry = useBlockRegistry()!;
    const BlockComponent = registry.current.components[block.type];

    if (BlockComponent) {
        return <BlockComponent data={block.attributes} />;
    }

    const fallback = registry.current.fallback;

    if (fallback) {
        return fallback(block);
    }

    return <FallbackBlock type={block.type} name={block.name} />;
};

export default useBlock;
