import { useEffect, useRef, useState } from 'react';

import { syncToPB, syncFromPB } from '../../helpers/communication';
import { createCssClassNames } from '../../helpers/cssClassNames';
import { getInvalidAttributeIds } from '../../helpers/validation';
import { useBlocksConfig } from '../../context/BlocksConfig';
import useBlock from '../../hooks/useBlock';
import { type Block as BlockData } from '../../types/FieldValue';

export interface Props {
    block: BlockData;
}

const BlockPBMode = ({ block }: Props) => {
    const blockRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const content = useBlock(block);
    const blocksConfig = useBlocksConfig();
    const blockConfig = blocksConfig.find((config) => config.type === block.type);
    const invalidAttributeIds = blockConfig ? getInvalidAttributeIds(block, blockConfig) : [];
    const isInvalid = invalidAttributeIds.length > 0;
    const innerClassName = createCssClassNames('c-pb-block-preview__inner', { 'c-pb-block-preview__inner--invalid': isInvalid });
    const className = createCssClassNames(['landing-page__block', `block_${block.type}`, 'c-pb-block-preview'], {
        'c-pb-block-preview--is-dragging-out': isDragging,
        'c-pb-block-preview--is-removing': isRemoving,
    });

    useEffect(() => {
        if (!blockRef.current) {
            return;
        }

        const abortController = new AbortController();
        const { signal } = abortController;

        blockRef.current.addEventListener(
            'click',
            () => {
                syncToPB('PB:BLOCK_CLICKED', { blockId: block.id });
            },
            { signal },
        );

        syncFromPB<{ blockId: string }>(
            'PB:SCROLL_INTO_BLOCK',
            (data) => {
                if (data.blockId === block.id && blockRef.current) {
                    blockRef.current.scrollIntoView({ behavior: 'smooth' });
                }
            },
            { signal },
        );

        syncFromPB<{ blockId: string }>(
            'PB:BLOCK_REMOVE',
            (data) => {
                if (data.blockId === block.id) {
                    setIsRemoving(true);
                }
            },
            { signal },
        );

        syncFromPB<{ blockId: string }>(
            'PB:DRAG_START_PREVIEW',
            (data) => {
                if (data.blockId === block.id) {
                    setIsDragging(true);
                }
            },
            { signal },
        );

        syncFromPB(
            'PB:DROP',
            () => {
                setIsDragging(false);
            },
            { signal },
        );

        return () => {
            abortController.abort();
        };
    }, [block.id]);

    const handleAnimationEnd = (event: React.AnimationEvent) => {
        if (event.animationName === 'remove-field') {
            syncToPB('APP:BLOCK_REMOVE_RESPONSE', { blockId: block.id });
        }
    };

    return (
        <div
            ref={blockRef}
            className={className}
            data-ibexa-block-id={block.id}
            draggable={isDragging}
            style={{ position: 'relative', scrollMargin: '2px' }}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className={innerClassName}>
                {isInvalid && (
                    <ul className="c-pb-block-preview__invalid-attributes">
                        {invalidAttributeIds.map((id) => (
                            <li key={id}>{`Value for attribute '${id}' is invalid: You must provide value`}</li>
                        ))}
                    </ul>
                )}
                {content}
            </div>
        </div>
    );
};

export default BlockPBMode;
