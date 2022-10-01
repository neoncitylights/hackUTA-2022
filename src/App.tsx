import React from 'react';
import { ItemCard } from './components/ItemCard';
import { SelectExample } from './components/Select';
import { MultipleComboBoxExample } from './components/MultiSelect';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <nav>
          <ul>
            <li>About</li>
            <li></li>
          </ul>
        </nav>
      </header>
      <section className="app-filter">
        <input className="search" type="search" placeholder="Find a dataset. Research and learn." />
        <section className="app-filters">
          <SelectExample books={[
		{author: 'Harper Lee', title: 'To Kill a Mockingbird'},
		{author: 'Lev Tolstoy', title: 'War and Peace'},
		{author: 'Fyodor Dostoyevsy', title: 'The Idiot'},
		{author: 'Oscar Wilde', title: 'A Picture of Dorian Gray'},
		{author: 'George Orwell', title: '1984'},
		{author: 'Jane Austen', title: 'Pride and Prejudice'},
		{author: 'Marcus Aurelius', title: 'Meditations'},
		{author: 'Fyodor Dostoevsky', title: 'The Brothers Karamazov'},
		{author: 'Lev Tolstoy', title: 'Anna Karenina'},
		{author: 'Fyodor Dostoevsky', title: 'Crime and Punishment'},
	]}/>
          <MultipleComboBoxExample />
        </section>
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
