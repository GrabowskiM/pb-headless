import useFieldValue from '../lib/hooks/useFieldValue';
import Zone from '../lib/components/Zone';

function Page() {
    const data = useFieldValue();

    console.log(data);
    return (
        <>
            <header>
                <h1>Page Builder Headless</h1>
            </header>
            <main>
                {data?.zones.map((zone) => <Zone zone={zone} key={zone.id} />)}
            </main>
            <footer>
                <p>Footer</p>
            </footer>
        </>
    );
}

export default Page;
