import { type ReactNode, useEffect, useState } from 'react';

import { syncFromPB } from '../../helpers/communication';
import { type DispatchEventMessage, type UpdateFieldDataMessage } from '../../types/PBMessages';
import { BlocksConfigContext } from '../../context/BlocksConfig';
import { BlocksIdMapContext } from '../../context/BlocksIdMap';
import { FieldValueContext } from '../../context/FieldValue';

interface Props {
    blocksConfig?: unknown[];
    blocksIdMap?: Map<string, unknown>;
    fieldValue?: unknown;
    children: ReactNode;
}

const LandingPagePBMode = ({
    blocksConfig: blocksConfigProp,
    blocksIdMap: blocksIdMapProp,
    fieldValue: fieldValueProp,
    children,
}: Props) => {
    const [blocksConfig, setBlocksConfig] = useState<unknown[]>(blocksConfigProp ?? []);
    const [prevBlocksConfigProp, setPrevBlocksConfigProp] = useState<unknown[] | undefined>(blocksConfigProp);
    const [blocksIdMap, setBlocksIdMap] = useState<Map<string, unknown>>(blocksIdMapProp ?? new Map());
    const [prevBlocksIdMapProp, setPrevBlocksIdMapProp] = useState<Map<string, unknown> | undefined>(blocksIdMapProp);
    const [fieldValue, setFieldValue] = useState<unknown>(fieldValueProp);
    const [prevFieldValueProp, setPrevFieldValueProp] = useState<unknown>(fieldValueProp);

    if (blocksConfigProp !== prevBlocksConfigProp) {
        setPrevBlocksConfigProp(blocksConfigProp);
        setBlocksConfig(blocksConfigProp ?? []);
    }

    if (blocksIdMapProp !== prevBlocksIdMapProp) {
        setPrevBlocksIdMapProp(blocksIdMapProp);
        setBlocksIdMap(blocksIdMapProp ?? new Map());
    }

    if (fieldValueProp !== prevFieldValueProp) {
        setPrevFieldValueProp(fieldValueProp);
        setFieldValue(fieldValueProp);
    }

    useEffect(() => {
        const cleanups = [
            syncFromPB<UpdateFieldDataMessage>(
                'PB:UPDATE_FIELD_DATA',
                (data) => {
                    console.log('Received UPDATE_FIELD_DATA', data);
                    if (data) {
                        setFieldValue(data.fieldValue);
                        setBlocksIdMap(data.blocksIdMap);
                        setBlocksConfig(data.blocksConfig);
                    }
                },
            ),
            syncFromPB<ScrollToOptions>('PB:SCROLL_BY', (data) => {
                window.scrollBy(data);
            }),
            syncFromPB<DispatchEventMessage>('PB:DISPATCH_EVENT', (data) => {
                console.log(data);
                document.body.dispatchEvent(new CustomEvent(data.eventName, { detail: data.eventDetail }));
            }),
        ];

        return () => cleanups.forEach((cleanup) => cleanup());
    }, []);

    return (
        <FieldValueContext.Provider value={fieldValue}>
            <BlocksConfigContext.Provider value={blocksConfig}>
                <BlocksIdMapContext.Provider value={blocksIdMap}>{children}</BlocksIdMapContext.Provider>
            </BlocksConfigContext.Provider>
        </FieldValueContext.Provider>
    );
};

export default LandingPagePBMode;
