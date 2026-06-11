import Block from '../Block';
import useIsPBMode from '../../hooks/useIsPBMode';
import { type Zone as ZoneData } from '../../types/FieldValue';
import ZonePBMode from './ZonePBMode';

export interface Props {
    zone: ZoneData;
}

const Zone = ({ zone }: Props) => {
    const isPBMode = useIsPBMode();

    if (isPBMode) {
        return <ZonePBMode zone={zone} />;
    }

    return (
        <>
            {zone.blocks.map((block) => (
                <Block key={block.id} block={block} />
            ))}
        </>
    );
};

export default Zone;
