
import { useState, useEffect } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ItemCard } from './components/ItemCard';
import { Item, SelectExample } from './components/Select';
import { MultipleComboBoxExample } from './components/MultiSelect';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import './App.css';
import { BellIcon } from '@radix-ui/react-icons';
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Link
// } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <span className="header-logo">R&D Data Inventory</span>
      <nav className="header-nav">
        <ul className="header-nav-items">
          <li className="nav-item"><BellIcon width={24} height={24} /></li>
          <li className="nav-item">About</li>
        </ul>
      </nav>
    </header>
  );
}

function App() {
  const [sources, setSources] = useState<{ name: string, url?: string, license?: string, description?: string, origins: string }[]>([])
  const [licenses, setLicenses] = useState<string[]>([])
  const [origins, setOrigins] = useState<string[]>([])
  useEffect(() => {
    void (async () => {
      const sources = await (await (fetch("/api/source", {
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }))).json();
      setSources(sources);
      console.log(sources);

      const licenses = await (await (fetch("/api/licenses", {
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }))).json();
      setLicenses(licenses);
      console.log(licenses);

      const origins = await (await (fetch("/api/origins", {
        headers: { Accept: 'application/json' },
        mode: 'cors',
      }))).json();
      setLicenses(origins);
      console.log(origins);
    })();
  }, []);
  
    let licensesMap: Item[] = licenses.map((val) => {
      return { title: val }
    });
    let originsMap: Item[] = origins.map((val) => {
      return { title: val }
    });
  
  return (
    <div className="App">
      <Header />
      {/* <Router>
        <Routes>
          <Route path="/" element={""} />
        </Routes>
      </Router> */}
      <section className="app-content">
        <section className="app-filter">
          <input className="search" type="search" placeholder="Find a dataset. Research and learn." />
          <section className="app-filters">
            <SelectExample selectTitle='Licenses' items={licensesMap} />
            <SelectExample selectTitle='Authors' items={originsMap} />
            <MultipleComboBoxExample selectTitle='Applications' items={[
              { subtitle: 'Google', title: 'Google LLC' },
              { subtitle: 'Something', title: 'Title of Something' },
            ]} />
          </section>
        </section>
        <main className="main-content">
          <section className="items">
            {Object.values(sources).map((item, i) => (
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
    </div>
  );
}

export default App;
