import classNames from "classnames";
import { useSelect } from 'downshift';
import './styles.css';

export type Item = { author: string, title: string };

export function SelectExample(books: Item[]) {
	function itemToString(item: Item|null): string {
		return item ? item.title : ''
	}
	function Select() {
	const {
		isOpen,
		selectedItem,
		getToggleButtonProps,
		getMenuProps,
		highlightedIndex,
		getItemProps,
	} = useSelect({
		items: books,
		itemToString,
	})

	return (
		<div className="select">
			<div className="select-filter">
				<button
					aria-label="toggle menu"
					className="select-filter-button"
					type="button"
					{...getToggleButtonProps()}>
					<span>{selectedItem ? selectedItem.title : 'Elements'}</span>
					<span className="px-2">{isOpen ? <>&#8593;</> : <>&#8595;</>}</span>
				</button>
			</div>
			<ul
				{...getMenuProps()}
				className="select-filter-dropdown">
				{isOpen &&
				books.map((item, index) => (
				<li
					className={classNames(
						highlightedIndex === index && 'select-item-highlighted',
						selectedItem === item && 'select-item-selected',
					)}
					key={`${item.title}${index}`}
					{...getItemProps({item, index})}>
					<span className="select-item-title">{item.title}</span>
					<span className="select-item-license">{item.author}</span>
				</li>
				))}
			</ul>
		</div>
		)
	}

	return <Select />
}
