interface Props {
    type: string;
    name: string;
}

const FallbackBlock = ({ type, name }: Props) => (
    <div>
        <p>Unknown block type: {type}</p>
        <p>Block name: {name}</p>
    </div>
);

export default FallbackBlock;
