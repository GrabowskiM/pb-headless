import { useEffect, useRef, useState } from 'react';

import { syncToPB, syncFromPB } from '../../helpers/communication';
import { createCssClassNames } from '../../helpers/cssClassNames';
import useBlockRegistry from '../../hooks/useBlockRegistry';
import { type Block as BlockData } from '../../types/FieldValue';

export interface Props {
    block: BlockData;
}

const Block = ({ block }: Props) => {
    const blockRef = useRef<HTMLDivElement>(null);
    const wasHoveredRef = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const registry = useBlockRegistry()!;
    const BlockComponent = registry.current.components[block.type];
    const fallback = registry.current.fallback;
    const className = createCssClassNames(['landing-page__block', `block_${block.type}`, 'c-pb-block-preview'], {
        'c-pb-block-preview--is-dragging-out': isDragging,
        'c-pb-block-preview--is-removing': isRemoving,
    });

    useEffect(() => {
        if (!blockRef.current) {
            return;
        }

        wasHoveredRef.current = false;

        const abortController = new AbortController();
        const { signal } = abortController;

        blockRef.current.addEventListener(
            'click',
            () => {
                syncToPB('PB:BLOCK_CLICKED', { blockId: block.id });
            },
            { signal },
        );

        blockRef.current.addEventListener(
            'mousemove',
            () => {
                if (!wasHoveredRef.current) {
                    const { top, left } = blockRef.current!.getBoundingClientRect();
                    wasHoveredRef.current = true;
                    syncToPB('APP:BLOCK_HOVER', { blockId: block.id, position: { top, left } });
                }
            },
            { signal },
        );

        blockRef.current.addEventListener(
            'mouseleave',
            () => {
                wasHoveredRef.current = false;
                syncToPB('APP:BLOCK_UNHOVER', { blockId: block.id });
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
    }, [block]);

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
            style={{ position: 'relative' }}
            onAnimationEnd={handleAnimationEnd}
        >
            <div className="c-pb-block-preview__inner">
                {BlockComponent ? <BlockComponent data={block.attributes} /> : fallback?.(block)}
            </div>
        </div>
    );
};

export default Block;
