
import { useState, useEffect } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ItemCard } from './components/ItemCard';
import { Item, SelectExample } from './components/Select';
import { MultipleComboBoxExample } from './components/MultiSelect';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import './App.css';
import { BellIcon } from '@radix-ui/react-icons';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Fuse from 'fuse.js';

function Header() {
  return (
    <header className="header">
      <span className="header-logo">R&D Data Inventory</span>
      <nav className="header-nav">
        <ul className="header-nav-items">
          <li className="nav-item"><BellIcon width={24} height={24} /></li>
          <li className="nav-item"><Link to="/">Home</Link></li>
          <li className="nav-item"><Link to="/about">About</Link></li>
        </ul>
      </nav>
    </header>
  );
}

function Home() {
  type Source = { name: string, url?: string, license?: string, description?: string, origins: string }
  const [sources, setSources] = useState<Source[]>([])
  const [licenses, setLicenses] = useState<string[]>([])
  const [origins, setOrigins] = useState<string[]>([])
  const [searchData, setSearchData] = useState<Source[]>([]);
  useEffect(() => {
    void (async () => {
      const sources: Source[] = await (await (fetch("/api/source", {
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }))).json();
      setSources(sources);
      // console.log(sources);

      const licenses = await (await (fetch("/api/licenses", {
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }))).json();
      setLicenses(licenses);
      // console.log(licenses);

      const origins = await (await (fetch("/api/origins", {
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }))).json();
      setOrigins(origins);
      // console.log(origins);

      // const searchItem = (query) => {
        // if (!query) {
        //   setSearchData(sources);
        //   return;
        // }
        const fuse = new Fuse<Source>(sources, {
          keys: ["licenses", "origins"]
        });
        const result = fuse.search("license");
        const finalResult: Source[] = [];
        if (result.length) {
          result.forEach(result => {
            finalResult.push(result.item);
          });
          setSearchData(finalResult);
        } else {
          setSearchData(sources);
        }
      // };

    })();
  }, []);

  let licensesMap: Item[] = licenses.map((val) => {
    return { title: val }
  });
  let originsMap: Item[] = origins.map((val) => {
    return { title: val }
  });

  return (
    <section className="app-content">
      <section className="app-filter">
        <input className="search" type="search" placeholder="Find a dataset. Research and learn." />
        <section className="app-filters">
          <SelectExample selectTitle='Licenses' items={licensesMap} />
          <SelectExample selectTitle='Authors' items={originsMap} />
          <MultipleComboBoxExample selectTitle='Applications' items={[
            { subtitle: 'Google', title: 'Google LLC' },
            { subtitle: 'Something', title: 'Title of Something' },
            { subtitle: 'Best DB', title: 'Duckie' },
          ]} />
        </section>
      </section>
      <main className="main-content">
        <section className="items">
          {Object.values(searchData).map((item, i) => (
            <ItemCard
              title={item.name}
              subtitle={item.origins ?? ''}
              description={item.description ?? ''}
              license={item.license ?? ''}
              url={item.url ?? ''} />
          ))}
        </section>
      </main>
    </section>
  );
}

function About() {
  return (<div>About page</div>);
}

function Admin() {
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [sqlOutput, setSqlOutput] = useState<string>('');
  const [csvInput, setCsvInput] = useState<string>('');
  const [overrideSource, setOverrideSource] = useState<boolean>(false);
  return (
    <main id="admin-main">
      <h1>Admin Page</h1>
      <section>
        <h2>Execute SQL Statement</h2>
        <textarea onChange={v => setSqlQuery(v.target.value)}></textarea><br />
        <button onClick={async () => {
          const response = await fetch(`/api/execute-sql/${encodeURIComponent(sqlQuery)}`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
          })
          const data = await response.json();
          if (data.success) {
            setSqlOutput(JSON.stringify(data, undefined, '\t'))
          } else {
            alert(`Failed executing SQL: ${data.message}`)
          }
        }}>Execute</button><br />
        <div className="sql-output">{sqlOutput || 'No SQL output.'}</div>
      </section>
      <section>
        <h2>Load Sources</h2>
        <p>Paste in a CSV formatted string with columns "Name,URL,License,Origin".</p>
        <textarea onChange={v => setCsvInput(v.target.value)}></textarea><br />
        <label>
          <input id="load-source-override-checkbox" type="checkbox" onChange={v => setOverrideSource(v.target.checked)} />
          Override existing sources
        </label><br />
        <button onClick={async () => {
          const response = await fetch('/api/load-sources', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              csv_content: csvInput,
              override_existing: overrideSource,
            })
          });
          const data = await response.json();
          if (data.success) {
            alert('Successfully loaded sources!');
          } else {
            alert(`Failed to load sources: ${data.message}`);
          }
        }}>Load</button>
      </section>
    </main>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
