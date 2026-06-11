import useBlock from '../../hooks/useBlock';
import useIsPBMode from '../../hooks/useIsPBMode';
import { type Block as BlockData } from '../../types/FieldValue';
import BlockPBMode from './BlockPBMode';

export interface Props {
    block: BlockData;
}

const Block = ({ block }: Props) => {
    const isPBMode = useIsPBMode();
    const content = useBlock(block);

    if (isPBMode) {
        return <BlockPBMode block={block} />;
    }

    return content;
};

export default Block;
