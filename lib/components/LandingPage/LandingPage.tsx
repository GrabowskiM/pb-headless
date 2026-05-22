import { type ComponentType, type ReactNode, useEffect, useRef, useState } from 'react';

import { syncFromPB, syncToPB } from '../../helpers/communication';
import { BlockRegistryContext, type BlockRegistry, type BlockComponentProps } from '../../context/BlockRegistry';
import { IsPBModeContext } from '../../context/IsPBMode';
import { type InitModeMessage } from '../../types/PBMessages';
import FallbackBlock from '../FallbackBlock';
import LandingPagePBMode, { type LandingPagePBModeHandle } from './LandingPagePBMode';

export interface Props {
    blocksConfig?: unknown[];
    blocksIdMap?: Map<string, unknown>;
    fieldValue?: unknown;
    blockComponents?: Record<string, ComponentType<BlockComponentProps>>;
    children: ReactNode;
}

const LandingPage = ({ blocksConfig, blocksIdMap, fieldValue, blockComponents, children }: Props) => {
    const [isPBMode, setIsPBMode] = useState(false);
    const pbInitDataRef = useRef<InitModeMessage | null>(null);
    const landingPagePBModeRef = useRef<LandingPagePBModeHandle>(null);
    const blockRegistryRef = useRef<BlockRegistry>({
        components: blockComponents ?? {},
        fallback: (block) => <FallbackBlock type={block.type} name={block.name} />,
    });

    useEffect(() => {
        syncToPB<never>('APP:INITIALIZED');

        const removeInitModeListener = syncFromPB<InitModeMessage | undefined>('PB:INIT_MODE', (data) => {
            pbInitDataRef.current = data ?? null;
            setIsPBMode(true);
        });

        return () => {
            removeInitModeListener();
        };
    }, []);

    useEffect(() => {
        if (isPBMode) {
            landingPagePBModeRef.current?.setInitData(pbInitDataRef.current ?? undefined);
        }
    }, [isPBMode]);

    return (
        <BlockRegistryContext.Provider value={blockRegistryRef}>
            <IsPBModeContext.Provider value={isPBMode}>
                {isPBMode ? (
                    <LandingPagePBMode
                        ref={landingPagePBModeRef}
                        blocksConfig={blocksConfig}
                        blocksIdMap={blocksIdMap}
                        fieldValue={fieldValue}
                    >
                        {children}
                    </LandingPagePBMode>
                ) : (
                    children
                )}
            </IsPBModeContext.Provider>
        </BlockRegistryContext.Provider>
    );
};

export default LandingPage;
