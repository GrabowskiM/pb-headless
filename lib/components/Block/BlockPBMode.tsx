import { useEffect, useRef, useState } from 'react';

import { syncToPB, syncFromPB } from '../../helpers/communication';
import { createCssClassNames } from '../../helpers/cssClassNames';
import { validateBlock, getInvalidAttributeIds } from '../../helpers/validation';
import { useBlocksConfig } from '../../context/BlocksConfig';
import useBlockRegistry from '../../hooks/useBlockRegistry';
import { type Block as BlockData } from '../../types/FieldValue';

export interface Props {
    block: BlockData;
}

const BlockPBMode = ({ block }: Props) => {
    const blockRef = useRef<HTMLDivElement>(null);
    const wasHoveredRef = useRef(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const registry = useBlockRegistry()!;
    const blocksConfig = useBlocksConfig();
    const BlockComponent = registry.current.components[block.type];
    const fallback = registry.current.fallback;
    const blockConfig = blocksConfig.find((config) => config.type === block.type);
    const invalidAttributeIds = blockConfig ? getInvalidAttributeIds(block, blockConfig) : [];
    const isInvalid = blockConfig ? !validateBlock(block, blockConfig) : false;
    const innerClassName = createCssClassNames('c-pb-block-preview__inner', { 'c-pb-block-preview__inner--invalid': isInvalid });
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
                if (!wasHoveredRef.current && blockRef.current) {
                    const { top, left } = blockRef.current.getBoundingClientRect();

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

        const lastMousePosRef = { x: 0, y: 0 };

        window.addEventListener(
            'mousemove',
            (e) => {
                lastMousePosRef.x = e.clientX;
                lastMousePosRef.y = e.clientY;
            },
            { signal, passive: true },
        );

        window.addEventListener(
            'scroll',
            () => {
                if (!blockRef.current) {
                    return;
                }

                const { top, left } = blockRef.current.getBoundingClientRect();

                if (wasHoveredRef.current) {
                    syncToPB('APP:BLOCK_POSITION_UPDATE', { blockId: block.id, position: { top, left } });

                    return;
                }

                const el = document.elementFromPoint(lastMousePosRef.x, lastMousePosRef.y);

                if (blockRef.current.contains(el) || el === blockRef.current) {
                    wasHoveredRef.current = true;
                    syncToPB('APP:BLOCK_HOVER', { blockId: block.id, position: { top, left } });
                }
            },
            { signal, passive: true },
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
            'PB:BLOCK_HOVER',
            (data) => {
                if (data.blockId === block.id && blockRef.current) {
                    const { top, left } = blockRef.current.getBoundingClientRect();

                    syncToPB('APP:BLOCK_HOVER', { blockId: block.id, position: { top, left } });
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
            <div className={innerClassName}>
                {isInvalid && (
                    <ul className="c-pb-block-preview__invalid-attributes">
                        {invalidAttributeIds.map((id) => (
                            <li key={id}>{`Value for attribute '${id}' is invalid: You must provide value`}</li>
                        ))}
                    </ul>
                )}
                {BlockComponent ? <BlockComponent data={block.attributes} /> : fallback?.(block)}
            </div>
        </div>
    );
};

export default BlockPBMode;
