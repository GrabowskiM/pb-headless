import { type ComponentType, type ReactNode, useEffect, useRef, useState } from 'react';

import { syncFromPB, syncToPB } from '../../helpers/communication';
import { BlockRegistryContext, type BlockRegistry, type BlockComponentProps } from '../../context/BlockRegistry';
import { IsPBModeContext } from '../../context/IsPBMode';
import { type InitModeMessage } from '../../types/PBMessages';
import FallbackBlock from '../FallbackBlock';
import LandingPagePBMode from './LandingPagePBMode';

export interface Props {
    blockComponents?: Record<string, ComponentType<BlockComponentProps>>;
    children: ReactNode;
}

const LandingPage = ({ blockComponents, children }: Props) => {
    const [isPBMode, setIsPBMode] = useState(false);
    const [initData, setInitData] = useState<InitModeMessage | undefined>(undefined);
    const blockRegistryRef = useRef<BlockRegistry>({
        components: blockComponents ?? {},
        fallback: (block) => <FallbackBlock type={block.type} name={block.name} />,
    });

    useEffect(() => {
        syncToPB<never>('APP:INITIALIZED');

        const removeInitModeListener = syncFromPB<InitModeMessage | undefined>('PB:INIT_MODE', (data) => {
            setInitData(data);
            setIsPBMode(true);
        });

        return () => {
            removeInitModeListener();
        };
    }, []);

    return (
        <BlockRegistryContext.Provider value={blockRegistryRef}>
            <IsPBModeContext.Provider value={isPBMode}>
                {isPBMode ? <LandingPagePBMode initData={initData}>{children}</LandingPagePBMode> : children}
            </IsPBModeContext.Provider>
        </BlockRegistryContext.Provider>
    );
};

export default LandingPage;
