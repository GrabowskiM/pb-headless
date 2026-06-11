import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { syncFromPB, syncToPB } from '../../helpers/communication';
import { type DispatchEventMessage, type InitModeMessage, type UpdateFieldDataMessage } from '../../types/PBMessages';
import { type FieldValue } from '../../types/FieldValue';
import { BlocksConfigContext, type BlockConfig } from '../../context/BlocksConfig';
import { BlocksIdMapContext } from '../../context/BlocksIdMap';
import { FieldValueContext } from '../../context/FieldValue';
import { collectPositions, type ElementPosition } from './LandingPagePBMode.utils';

const POSITION_UPDATE_INTERVAL = 5000;
const POSITION_UPDATE_INTERVAL_MIN = 500;
const POSITION_UPDATE_ELAPSED_MULTIPLIER = 10;

interface Props {
    initData?: InitModeMessage;
    children: ReactNode;
}

const LandingPagePBMode = ({ initData, children }: Props) => {
    const [blocksConfig, setBlocksConfig] = useState<BlockConfig[]>(initData?.blocksConfig ?? []);
    const [blocksIdMap, setBlocksIdMap] = useState<Map<string, unknown>>(initData?.blocksIdMap ?? new Map());
    const [fieldValue, setFieldValue] = useState<unknown>(initData?.fieldValue);
    const cachedBlockPositionsRef = useRef(new Map<string, ElementPosition>());
    const cachedZonePositionsRef = useRef(new Map<string, ElementPosition>());
    const rafIdRef = useRef<number | null>(null);
    const isProgrammaticScrollRef = useRef(false);

    const sendPositions = useCallback(() => {
        const blockElements = document.querySelectorAll<HTMLElement>('[data-ibexa-block-id]');
        const zoneElements = document.querySelectorAll<HTMLElement>('[data-ibexa-zone-id]');

        const { positions: blocks, hasChanges: blocksChanged } = collectPositions(
            blockElements,
            'ibexaBlockId',
            cachedBlockPositionsRef.current,
        );
        const { positions: zones, hasChanges: zonesChanged } = collectPositions(
            zoneElements,
            'ibexaZoneId',
            cachedZonePositionsRef.current,
        );

        if (!blocksChanged && !zonesChanged) {
            return;
        }

        cachedBlockPositionsRef.current.clear();
        blocks.forEach(({ id, ...rect }) => cachedBlockPositionsRef.current.set(id, rect));

        cachedZonePositionsRef.current.clear();
        zones.forEach(({ id, ...rect }) => cachedZonePositionsRef.current.set(id, rect));

        syncToPB('APP:POSITIONS_UPDATE', { blocks, zones });
    }, []);

    const requestPositionUpdate = useCallback(() => {
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            sendPositions();
        });
    }, [sendPositions]);

    useEffect(() => {
        sendPositions();

        const mutationObserver = new MutationObserver(requestPositionUpdate);
        const resizeObserver = new ResizeObserver(requestPositionUpdate);

        mutationObserver.observe(document.body, { childList: true, subtree: true });
        resizeObserver.observe(document.body);
        const onScroll = () => {
            if (isProgrammaticScrollRef.current) {
                return;
            }

            requestPositionUpdate();
        };

        window.addEventListener('scroll', onScroll, { passive: true });

        const onScrollEnd = () => {
            isProgrammaticScrollRef.current = false;
            sendPositions();
            syncToPB('APP:SCROLL_END', {});
        };

        window.addEventListener('scrollend', onScrollEnd, { passive: true });

        return () => {
            mutationObserver.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('scrollend', onScrollEnd);

            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = null;
            }
        };
    }, [sendPositions, requestPositionUpdate]);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        const scheduleNextUpdate = () => {
            const start = performance.now();

            sendPositions();

            const elapsed = performance.now() - start;
            const interval = Math.min(
                Math.max(elapsed * POSITION_UPDATE_ELAPSED_MULTIPLIER, POSITION_UPDATE_INTERVAL_MIN),
                POSITION_UPDATE_INTERVAL,
            );

            timeoutId = setTimeout(scheduleNextUpdate, interval);
        };

        scheduleNextUpdate();

        return () => {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
            }
        };
    }, [sendPositions]);

    useEffect(() => {
        const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
            syncToPB('APP:MOUSE_POSITION', { x: clientX, y: clientY });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const cleanups = [
            syncFromPB<UpdateFieldDataMessage>('PB:UPDATE_FIELD_DATA', (data) => {
                if (data) {
                    setFieldValue(data.fieldValue);
                    setBlocksIdMap(data.blocksIdMap);
                    setBlocksConfig(data.blocksConfig);
                }
            }),
            syncFromPB<ScrollToOptions>('PB:SCROLL_BY', (data) => {
                isProgrammaticScrollRef.current = true;
                window.scrollBy(data);
            }),
            syncFromPB<DispatchEventMessage>('PB:DISPATCH_EVENT', (data) => {
                document.body.dispatchEvent(new CustomEvent(data.eventName, { detail: data.eventDetail }));
            }),
        ];

        return () => cleanups.forEach((cleanup) => cleanup());
    }, []);

    return (
        <FieldValueContext.Provider value={fieldValue as FieldValue | undefined}>
            <BlocksConfigContext.Provider value={blocksConfig}>
                <BlocksIdMapContext.Provider value={blocksIdMap}>{children}</BlocksIdMapContext.Provider>
            </BlocksConfigContext.Provider>
        </FieldValueContext.Provider>
    );
};

export default LandingPagePBMode;
