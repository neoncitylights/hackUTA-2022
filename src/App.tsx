
import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { BellIcon } from '@radix-ui/react-icons';
import Fuse from 'fuse.js';
import { ItemCard } from './components/ItemCard';
import { Item, SelectExample } from './components/Select';
import { MultipleComboBoxExample } from './components/MultiSelect';
import './App.css';
// @ts-ignore
import undrawImage from './undraw_illustration.svg';

function Header() {
  return (
    <header className="header">
      <span className="header-logo">Datageddon</span>
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
  type Source = { name: string, url?: string, license?: string, description?: string, origin: string, application: string }
  const [sources, setSources] = useState<Source[]>([])
  const [licenses, setLicenses] = useState<string[]>([])
  const [origins, setOrigins] = useState<string[]>([])
  const [applications, setApplications] = useState<string[]>([])
  const [searchData, setSearchData] = useState<Source[]>([])

  useEffect(() => {
    void (async () => {
      const sources: Source[] = await (await (fetch("/api/source", {
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }))).json();
      setSources(sources);

      const licenses: string[] = await (await (fetch("/api/licenses", {
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }))).json();
      setLicenses(['Licenses', ...licenses]);

      const origins: string[] = await (await (fetch("/api/origins", {
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }))).json();
      setOrigins(['Authors', ...origins]);

      const applications: string[] = await (await (fetch("/api/applications", {
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }))).json();
      setApplications(applications);

      setSearchData(sources);
    })();
  }, []);

  const searchItem = (query: string) => {
    if (!query) {
      setSearchData(sources);
      return;
    }
    const fuse = new Fuse<Source>(sources, {
      keys: [{name: 'name', weight: 2},
             {name: 'license', weight: 0.5},
             "origin",
             "application"],
    });
    const result = fuse.search(query);
    const finalResult: Source[] = [];
    if (result.length) {
      result.forEach(result => {
        finalResult.push(result.item);
      });
      setSearchData(finalResult);
    } else {
      setSearchData(sources);
    }
  };

  let licensesMap: Item[] = licenses.map((val) => {
    return { title: val }
  });
  let originsMap: Item[] = origins.map((val) => {
    return { title: val }
  });

  return (
    <section className="app-content">
      <img src={undrawImage} className="illustration" width="200px" />
      <h1>Datageddon</h1>
      <span className="project-desc">
        <span>Where students and researchers go to learn.</span>
        <span>Use them for your <mark>machine learning</mark> models, <mark>research</mark> papers, and general education.</span>
      </span>
      <section className="app-filter">
        <input id="search-input" className="search" type="search" placeholder="Find a dataset. Research and learn." onChange={(e) => {
          searchItem(e.target.value)
        }} />
        <section className="app-filters">
          <SelectExample selectTitle='Licenses' items={licensesMap} updateData={searchItem}/>
          <SelectExample selectTitle='Authors' items={originsMap} updateData={searchItem}/>
          <MultipleComboBoxExample selectTitle='Applications' items={applications.map(v => ({ title: v }))} updateData={searchItem} />
        </section>
      </section>
      <main className="main-content">
        <section className="items">
          {Object.values(searchData).map((item, i) => (
            <ItemCard
              title={item.name}
              subtitle={item.origin ?? ''}
              description={item.description ?? ''}
              license={item.license ?? ''}
              url={item.url ?? ''}
              applications={item.application ?? ''} />
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
  const [updateSource, setUpdateSource] = useState<string>('');
  const [updateDetails, setUpdateDetails] = useState<string>('');
  return (
    <main id="admin-main">
      <h1>Admin Page</h1>
      <section>
        <h2>Send Update</h2>
        <label>Source: <input type="text" onChange={v => setUpdateSource(v.target.value)} /></label><br />
        <label>Details: <textarea onChange={v => setUpdateDetails(v.target.value)} ></textarea></label><br />
        <button type="button" onClick={async () => {
          const response = await fetch('/api/admin/send-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source_name: updateSource,
              details: updateDetails,
            })
          });
          const data = await response.json();
          if (data.success) {
            alert(`Sent update to ${data.total_sent} phones!`);
          } else {
            alert(`Failed to send update: ${data.message}`);
          }
        }}>Send Update</button>
      </section>
      <hr />
      <section>
        <h2>Load Sources</h2>
        <p>Paste in a CSV formatted string with columns "Name", "URL", "Origin", "License", and "Applications".</p>
        <textarea onChange={v => setCsvInput(v.target.value)}></textarea><br />
        <label>
          <input id="load-source-override-checkbox" type="checkbox" onChange={v => setOverrideSource(v.target.checked)} />
          Override existing sources
        </label><br />
        <button onClick={async () => {
          const response = await fetch('/api/admin/load-sources', {
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
      <hr />
      <section>
        <h2>Execute SQL Statement</h2>
        <textarea onChange={v => setSqlQuery(v.target.value)}></textarea><br />
        <button onClick={async () => {
          setSqlOutput('Executing...');
          const response = await fetch(`/api/admin/execute-sql/${encodeURIComponent(sqlQuery)}`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
          })
          const data = await response.json();
          if (data.success) {
            setSqlOutput(JSON.stringify(data, undefined, 3))
          } else {
            setSqlOutput(`Failed: ${data.message}`);
          }
        }}>Execute</button><br />
        <div className="sql-output">{sqlOutput || 'No SQL output.'}</div>
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
