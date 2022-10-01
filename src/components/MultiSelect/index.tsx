import React from "react";
import { useCombobox, useMultipleSelection } from "downshift";
import classNames from "classnames";
import { ChevronDownIcon } from '@radix-ui/react-icons';
import './styles.css';

type Item = { author: string, title: string };

export function MultipleComboBoxExample() {
    const books: Item[] = [
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
    ]
    const initialSelectedItems: Item[] = [books[0], books[1]]
  
    function getFilteredBooks(selectedItems: Item[], inputValue: string) {
      const lowerCasedInputValue = inputValue.toLowerCase()
  
      return books.filter(function filterBook(book) {
        return (
          !selectedItems.includes(book) &&
          (book.title.toLowerCase().includes(lowerCasedInputValue) ||
            book.author.toLowerCase().includes(lowerCasedInputValue))
        )
      })
    }
  
    function MultipleComboBox() {
      const [inputValue, setInputValue] = React.useState('')
      const [selectedItems, setSelectedItems] = React.useState(initialSelectedItems)
      const items = React.useMemo(
        () => getFilteredBooks(selectedItems, inputValue),
        [selectedItems, inputValue],
      )
      const {
        getSelectedItemProps,
        getDropdownProps,
        addSelectedItem,
        removeSelectedItem,
      } = useMultipleSelection({
        selectedItems,
        onStateChange({selectedItems: newSelectedItems, type}) {
          switch (type) {
            case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownBackspace:
            case useMultipleSelection.stateChangeTypes.SelectedItemKeyDownDelete:
            case useMultipleSelection.stateChangeTypes.DropdownKeyDownBackspace:
            case useMultipleSelection.stateChangeTypes.FunctionRemoveSelectedItem:
              setSelectedItems(newSelectedItems as Item[])
              break
            default:
              break
          }
        },
      })
      const {
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        getComboboxProps,
        highlightedIndex,
        getItemProps,
        selectedItem,
      } = useCombobox({
        items,
        itemToString(item) {
          return item ? item.title : ''
        },
        defaultHighlightedIndex: 0, // after selection, highlight the first item.
        selectedItem: null,
        stateReducer(state, actionAndChanges) {
          const {changes, type} = actionAndChanges
  
          switch (type) {
            case useCombobox.stateChangeTypes.InputKeyDownEnter:
            case useCombobox.stateChangeTypes.ItemClick:
            case useCombobox.stateChangeTypes.InputBlur:
              return {
                ...changes,
                ...(changes.selectedItem && {isOpen: true, highlightedIndex: 0}),
              }
            default:
              return changes
          }
        },
        onStateChange({
          inputValue: newInputValue,
          type,
          selectedItem: newSelectedItem,
        }) {
          switch (type) {
            case useCombobox.stateChangeTypes.InputKeyDownEnter:
            case useCombobox.stateChangeTypes.ItemClick:
              setSelectedItems([...selectedItems!, newSelectedItem!])
              break
            case useCombobox.stateChangeTypes.InputChange:
              setInputValue(newInputValue as string)
              break
            default:
              break
          }
        },
      })
  
      return (
        <div className="multiselect">
          <div className="multiselect-input">
              { selectedItems.map(function renderSelectedItem(
                selectedItemForRender,
                index,
              ) {
                return (
                    
                        <span
                        className="selected-item"
                        key={`selected-item-${index}`}
                        {...getSelectedItemProps({
                            selectedItem: selectedItemForRender,
                            index,
                        })}
                        >
                        {selectedItemForRender.title}
                        <span
                            className="px-1 cursor-pointer"
                            onClick={e => {
                            e.stopPropagation()
                            removeSelectedItem(selectedItemForRender)
                            }}
                        >
                            &#10005;
                        </span>
                        </span>
                )
              })}
              <div className="flex gap-0.5 grow" {...getComboboxProps()}>
                <input
                  placeholder="Applications"
                  className="w-full"
                  {...getInputProps(getDropdownProps({preventKeyAction: isOpen}))}
                />
                <button
                  aria-label="toggle menu"
                  className="px-2"
                  type="button"
                  {...getToggleButtonProps()}
                >
                <ChevronDownIcon />
                </button>
            </div>
          </div>
          <ul
            {...getMenuProps()}
            className="absolute p-0 bg-white shadow-md max-h-80 overflow-scroll w-inherit">
            {isOpen &&
              items.map((item, index) => (
                <li
                  className={classNames(
                    highlightedIndex === index && 'bg-blue-300',
                    selectedItem === item && 'font-bold',
                    'py-2 px-3 shadow-sm flex flex-col',
                  )}
                  key={`${item.title}${index}`}
                  {...getItemProps({item, index})}>
                  <span>{item.title}</span>
                  <span className="text-sm text-gray-700">{item.author}</span>
                </li>
              ))}
          </ul>
        </div>
      )
    }
    return <MultipleComboBox />
}