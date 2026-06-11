import LandingPage from '../lib/components/LandingPage';
import Page from './Page';
import TagBlock from './blocks/TagBlock';
import RichTextBlock from './blocks/RichTextBlock';
import './ibexa-page-builder-iframe-editor-ui-css.css';
import './App.css';

function App() {
    return (
        <LandingPage
            blockComponents={{ tag: TagBlock, richtext: RichTextBlock }}
        >
            <Page />
        </LandingPage>
    );
}

export default App;
