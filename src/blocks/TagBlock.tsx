import { type BlockComponentProps } from '../../lib/context/BlockRegistry';

const TagBlock = ({ data }: BlockComponentProps) => {
    const content = data.find((attr) => attr.name === 'content')?.value ?? '';

    return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default TagBlock;
