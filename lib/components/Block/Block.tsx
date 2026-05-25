import useBlockRegistry from '../../hooks/useBlockRegistry';
import useIsPBMode from '../../hooks/useIsPBMode';
import { type Block as BlockData } from '../../types/FieldValue';
import BlockPBMode from './BlockPBMode';

export interface Props {
    block: BlockData;
}

const Block = ({ block }: Props) => {
    const isPBMode = useIsPBMode();
    const registry = useBlockRegistry()!;
    const BlockComponent = registry.current.components[block.type];
    const fallback = registry.current.fallback;

    if (isPBMode) {
        return <BlockPBMode block={block} />;
    }

    return (
        <div className={`landing-page__block block_${block.type}`} data-ibexa-block-id={block.id}>
            {BlockComponent ? <BlockComponent data={block.attributes} /> : fallback?.(block)}
        </div>
    );
};

export default Block;
