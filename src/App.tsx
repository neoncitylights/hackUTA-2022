import React from 'react';
import { TopicsDropdown } from './components/TopicsDropdown';
import { ItemCard } from './components/ItemCard';
import './App.css';

function App() {
  return (
    <div className="App">
      <section className="app-filter">
        <input className="search" type="search" placeholder="Find a dataset. Research and learn." />
        <TopicsDropdown />
      </section>
      <main className="main-content">
        <section className="items">
          <ItemCard
            title="AudioSet"
            subtitle="Google"
            description="A large-scale dataset of manually annotated audio events"/>

          <ItemCard
            title="YouTube-8M"
            subtitle="Google"
            description="An 8-million size database of labeled YouTube videos"/>
        </section>
      </main>
    </div>
  );
}

export default App;
