import React from "react";
import { useCombobox, useMultipleSelection } from "downshift";
import classNames from "classnames";
import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import './styles.css';

export type Item = { subtitle: string, title: string };
export type MultipleComboBoxProps = {
  items: Item[],
  selectTitle: string,
}

export function MultipleComboBoxExample({items, selectTitle}: MultipleComboBoxProps) {
    const initialSelectedItems: Item[] = []
  
    function getFilteredBooks(selectedItems: Item[], inputValue: string) {
      const lowerCasedInputValue = inputValue.toLowerCase()
  
      return items.filter(function filterBook(book) {
        return (
          !selectedItems.includes(book) &&
          (book.title.toLowerCase().includes(lowerCasedInputValue) ||
            book.subtitle.toLowerCase().includes(lowerCasedInputValue))
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

      const renderMultiSelectContainer = () => {
        if(isOpen) {
          return (
          <ul
            {...getMenuProps()}
            className="multiselect-container">
            {items.map((item, index) => (
                <li
                  className={classNames(
                    highlightedIndex === index && 'bg-blue-300',
                    selectedItem === item && 'font-bold',
                    'py-2 px-3 shadow-sm flex flex-col',
                  )}
                  key={`${item.title}${index}`}
                  {...getItemProps({item, index})}>
                  <span>{item.title}</span>
                  <span className="text-sm text-gray-700">{item.subtitle}</span>
                </li>
              ))}
          </ul>);
        } else {
          return <></>;
        }
      }
  
      return (
        <div className="multiselect">
          <div className="multiselect-input">
            <div className="selected-items-horizontal">
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
            </div>
            <div className="flex gap-0.5 grow" {...getComboboxProps()}>
              <input
                placeholder={selectTitle}
                className="w-full"
                {...getInputProps(getDropdownProps({preventKeyAction: isOpen}))}
              />
              <button
                aria-label="toggle menu"
                className="multiselect-filter-button"
                type="button"
                {...getToggleButtonProps()}
              >
                {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </button>
            </div>
          </div>
          {renderMultiSelectContainer()}
        </div>
      )
    }
    return <MultipleComboBox />
}