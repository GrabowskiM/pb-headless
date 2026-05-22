import LandingPage from '../lib/components/LandingPage';
import Page from './Page';
import demoData from './demoData';
import TagBlock from './blocks/TagBlock';
import RichTextBlock from './blocks/RichTextBlock';
import './ibexa-page-builder-iframe-editor-ui-css.css';
import './App.css';

function App() {
    return (
        <LandingPage
            blocksConfig={demoData.blocksConfig}
            blocksIdMap={demoData.blocksIdMap}
            fieldValue={demoData.fieldValue}
            blockComponents={{ tag: TagBlock, richtext: RichTextBlock }}
        >
            <Page />
        </LandingPage>
    );
}

export default App;
