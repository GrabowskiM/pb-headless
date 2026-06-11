import { type BlockConfig } from '../context/BlocksConfig';
import { type Block } from '../types/FieldValue';

const isAttributeValueBlank = (value: string | null | undefined): boolean => {
    if (value === null || value === undefined || value === '') {
        return true;
    }

    return !`${value}`.trim().length;
};

export const getInvalidAttributeIds = (block: Block, config: BlockConfig): string[] => {
    if (!config.visible) {
        return [];
    }

    return block.attributes
        .filter((attribute) => {
            const attrConfig = config.attributes.find((a) => a.id === attribute.name);

            const constraints = attrConfig?.constraints;
            const hasNotBlank = !Array.isArray(constraints) && constraints?.['not_blank'];

            return hasNotBlank && isAttributeValueBlank(attribute.value);
        })
        .map((attribute) => attribute.name);
};
