import { useContext } from 'react';

import { IsPBModeContext } from '../context/IsPBMode';

// const isInIframe = () => window.self !== window.top;
const isInIframe = () => true;

const useIsPBMode = () => {
    const isPBMode = useContext(IsPBModeContext);

    return isInIframe() && isPBMode;
};

export default useIsPBMode;
