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
        <div className={`landing-page__zone landing-page__zone--${zone.id}`} data-ibexa-zone-id={zone.id}>
            {zone.blocks.map((block) => (
                <Block key={block.id} block={block} />
            ))}
        </div>
    );
};

export default Zone;
