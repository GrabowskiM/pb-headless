import { type ReactNode, useRef, useState } from 'react';

import { createCssClassNames } from '../../helpers/cssClassNames';

export interface Props {
    zone: string;
    children?: ReactNode;
}

const Zone = ({ zone, children }: Props) => {
    const zoneRef = useRef<HTMLDivElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const className = createCssClassNames(
        ['landing-page__zone', `landing-page__zone--${zone}`, 'm-page-builder__zone'],
        { 'm-page-builder__zone--dragover': isDragOver },
    );

    return (
        <div
            ref={zoneRef}
            className={className}
            data-call-to-action-text="Drag and drop blocks here"
            onDragOver={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)}
        >
            {children}
        </div>
    );
};

export default Zone;
