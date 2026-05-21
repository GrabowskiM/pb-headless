import { type ReactNode, useEffect, useState } from 'react';

import { syncToPB } from '../../helpers/communication';
import { IsPBModeContext } from '../../context/IsPBMode';
import LandingPagePBMode from './LandingPagePBMode';

export interface Props {
    blocksConfig?: unknown[];
    blocksIdMap?: Map<string, unknown>;
    fieldValue?: unknown;
    children: ReactNode;
}

const LandingPage = ({ blocksConfig, blocksIdMap, fieldValue, children }: Props) => {
    const [isPBMode, setIsPBMode] = useState(true);

    useEffect(() => {
        const handleMessage = (event: MessageEvent<{ type: string }>): void => {
            if (event.data.type === 'PB:INIT_MODE') {
                setIsPBMode(true);
            }
        };

        syncToPB<never>('APP:INITIALIZED');

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);

    return (
        <IsPBModeContext.Provider value={isPBMode}>
            {isPBMode ? (
                <LandingPagePBMode blocksConfig={blocksConfig} blocksIdMap={blocksIdMap} fieldValue={fieldValue}>
                    {children}
                </LandingPagePBMode>
            ) : (
                children
            )}
        </IsPBModeContext.Provider>
    );
};

export default LandingPage;
