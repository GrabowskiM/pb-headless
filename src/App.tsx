import LandingPage from '../lib/components/LandingPage';
import demoData from './demoData';
import './App.css';

function App() {
    return (
        <LandingPage
            blocksConfig={demoData.blocksConfig}
            blocksIdMap={demoData.blocksIdMap}
            fieldValue={demoData.fieldValue}
        >
            <header>
                <h1>Page Builder Headless</h1>
            </header>
            <main>
                <p>Landing page content</p>
            </main>
            <footer>
                <p>Footer</p>
            </footer>
        </LandingPage>
    );
}

export default App;
