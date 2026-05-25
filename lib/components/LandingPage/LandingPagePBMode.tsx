import { forwardRef, type ReactNode, useEffect, useImperativeHandle, useState } from 'react';

import { syncFromPB } from '../../helpers/communication';
import { type DispatchEventMessage, type InitModeMessage, type UpdateFieldDataMessage } from '../../types/PBMessages';
import { type FieldValue } from '../../types/FieldValue';
import { BlocksConfigContext, type BlockConfig } from '../../context/BlocksConfig';
import { BlocksIdMapContext } from '../../context/BlocksIdMap';
import { FieldValueContext } from '../../context/FieldValue';

export interface LandingPagePBModeHandle {
    setInitData: (data?: InitModeMessage) => void;
}

interface Props {
    blocksConfig?: BlockConfig[];
    blocksIdMap?: Map<string, unknown>;
    fieldValue?: unknown;
    children: ReactNode;
}

const LandingPagePBMode = forwardRef<LandingPagePBModeHandle, Props>(
    ({ blocksConfig: blocksConfigProp, blocksIdMap: blocksIdMapProp, fieldValue: fieldValueProp, children }: Props, ref) => {
        const [blocksConfig, setBlocksConfig] = useState<BlockConfig[]>(blocksConfigProp ?? []);
        const [prevBlocksConfigProp, setPrevBlocksConfigProp] = useState<BlockConfig[] | undefined>(blocksConfigProp);
        const [blocksIdMap, setBlocksIdMap] = useState<Map<string, unknown>>(blocksIdMapProp ?? new Map());
        const [prevBlocksIdMapProp, setPrevBlocksIdMapProp] = useState<Map<string, unknown> | undefined>(blocksIdMapProp);
        const [fieldValue, setFieldValue] = useState<unknown>(fieldValueProp);
        const [prevFieldValueProp, setPrevFieldValueProp] = useState<unknown>(fieldValueProp);
        const [isInitialized, setIsInitialized] = useState(false);

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

        useImperativeHandle(ref, () => ({
            setInitData: (data?: InitModeMessage) => {
                if (data) {
                    setBlocksConfig(data.blocksConfig);
                    setBlocksIdMap(data.blocksIdMap);
                    setFieldValue(data.fieldValue);
                }
                setIsInitialized(true);
            },
        }));

        useEffect(() => {
            const cleanups = [
                syncFromPB<UpdateFieldDataMessage>('PB:UPDATE_FIELD_DATA', (data) => {
                    console.log('Received UPDATE_FIELD_DATA', data);
                    if (data) {
                        setFieldValue(data.fieldValue);
                        setBlocksIdMap(data.blocksIdMap);
                        setBlocksConfig(data.blocksConfig);
                    }
                }),
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

        if (!isInitialized) {
            return null;
        }

        return (
            <FieldValueContext.Provider value={fieldValue as FieldValue | undefined}>
                <BlocksConfigContext.Provider value={blocksConfig}>
                    <BlocksIdMapContext.Provider value={blocksIdMap}>{children}</BlocksIdMapContext.Provider>
                </BlocksConfigContext.Provider>
            </FieldValueContext.Provider>
        );
    },
);

LandingPagePBMode.displayName = 'LandingPagePBMode';

export default LandingPagePBMode;
