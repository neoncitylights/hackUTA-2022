import classNames from "classnames";
import { useSelect } from 'downshift';
import './styles.css';
import { ChevronUpIcon, ChevronDownIcon} from '@radix-ui/react-icons';

export type Item = { title: string };
export type SelectProps = {
	items: Item[],
	selectTitle: string,
}

export function SelectExample({items, selectTitle}: SelectProps) {
	function itemToString(item: Item|null): string {
		return item ? item.title : ''
	}

	const {
		isOpen,
		selectedItem,
		getToggleButtonProps,
		getMenuProps,
		highlightedIndex,
		getItemProps,
	} = useSelect({
		items: items,
		itemToString,
	})


	const renderSelectDropdown = () => {
		if(isOpen) {
			return (
			<ul
				{...getMenuProps()}
				className="select-filter-dropdown">
				{isOpen && items.map((item, index) => (
				<li
					className={classNames(
						highlightedIndex === index && 'select-item-highlighted',
						selectedItem === item && 'select-item-selected',
					)}
					key={`${item.title}${index}`}
					{...getItemProps({item, index})}>
					<span className="select-item-title">{item.title}</span>
				</li>
				))}
			</ul>);
		} else {
			return <></>;
		}
	}

	return (
		<div className="select">
			<div className="select-filter">
				<button
					aria-label="toggle menu"
					className="select-filter-button"
					type="button"
					{...getToggleButtonProps()}>
					<span>{selectedItem ? selectedItem.title : selectTitle}</span>
					{/* {selectedItem ? propertySet(selectedItem.title) : propertySet('')} */}
					<span className="px-2">{isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</span>
				</button>
			</div>
			{renderSelectDropdown()}
		</div>
	);
}
