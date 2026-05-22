import { Fragment, useEffect, useMemo, useRef, useState } from 'react';

import { syncToPB, syncFromPB } from '../../helpers/communication';
import { createCssClassNames } from '../../helpers/cssClassNames';
import Block from '../Block';
import useFieldValue from '../../hooks/useFieldValue';
import { type Zone as ZoneData } from '../../types/FieldValue';

export interface Props {
    zone: ZoneData;
}

const Zone = ({ zone }: Props) => {
    const zoneRef = useRef<HTMLDivElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [placeholderPositionIndex, setPlaceholderPositionIndex] = useState<number | null>(null);
    const fieldValue = useFieldValue();
    const zoneNo = useMemo(() => (fieldValue?.zones.findIndex((z) => z.id === zone.id) ?? -1) + 1, [fieldValue, zone.id]);
    const className = createCssClassNames(['landing-page__zone', `landing-page__zone--${zone.id}`, 'm-page-builder__zone'], {
        'm-page-builder__zone--dragover': isDragOver,
    });

    useEffect(() => {
        const cleanups = [
            syncFromPB('PB:UPDATE_FIELD_DATA', () => {
                setPlaceholderPositionIndex(null);
            }),
            syncFromPB<{ x: number; y: number }>('PB:DRAG_OVER', (data) => {
                const element = document.elementFromPoint(data.x, data.y);

                if (zoneRef.current?.contains(element)) {
                    const blocksNodes = Array.from(zoneRef.current.querySelectorAll('[data-ibexa-block-id]'));
                    let newIndex = blocksNodes.length;

                    for (let i = 0; i < blocksNodes.length; i++) {
                        const { top, height } = blocksNodes[i].getBoundingClientRect();

                        if (data.y < top + height / 2) {
                            newIndex = i;
                            break;
                        }
                    }

                    setPlaceholderPositionIndex(newIndex);
                    setIsDragOver(true);
                } else {
                    setPlaceholderPositionIndex(null);
                    setIsDragOver(false);
                }
            }),
            syncFromPB('PB:DROP', () => {
                setIsDragOver(false);

                if (placeholderPositionIndex !== null) {
                    const nextBlockId = zone.blocks[placeholderPositionIndex]?.id;

                    setPlaceholderPositionIndex(null);
                    syncToPB('DROP_RESPONSE', { zoneId: zone.id, nextBlockId });
                }
            }),
        ];

        return () => cleanups.forEach((cleanup) => cleanup());
    }, [zone.id, zone.blocks, placeholderPositionIndex]);

    return (
        <div
            ref={zoneRef}
            className={className}
            data-ibexa-zone-id={zone.id}
            data-call-to-action-text="Drag and drop blocks here"
            onDragOver={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
        >
            <fieldset className="m-page-builder__fieldset">
                <legend className="m-page-builder__legend">Drop zone {zoneNo}</legend>
            </fieldset>
            {zone.blocks.length > 0 ? (
                <>
                    {zone.blocks.map((block, index) => (
                        <Fragment key={block.id}>
                            {index === placeholderPositionIndex && <div className="droppable-placeholder" />}
                            <Block block={block} />
                        </Fragment>
                    ))}
                    {placeholderPositionIndex === zone.blocks.length && <div className="droppable-placeholder" />}
                </>
            ) : (
                <div className="landing-page__zone-empty">Drop blocks here</div>
            )}
        </div>
    );
};

export default Zone;
