import {SelectProps} from './select.classes';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronDown, faClose, faSearch} from '@fortawesome/free-solid-svg-icons';
import {useDebounce} from 'hooks/use-debounce';

function BaseSelect<T extends {[key: string]: string | number | undefined;}>(props: SelectProps<T>) {
    const {
        label = props.fetchData ? 'Search' : 'Select an item',
        labelKey,
        options,
        onChange,
        className,
        clearable,
        autocomplete,
        fetchData,
        minLengthToFetch = 3,
        noOptionsText = 'No options',
    } = props;

    const ref = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<T | null>(null);
    const [active, setActive] = useState<T | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<T[]>(options || []);
    const debounceSearch = useDebounce(inputValue, 500);

    const toggle = () => setOpen(!open);

    const handleSelect = (option: T) => {
        setSelected(option);
        setInputValue( '');
        if (onChange) onChange(option);
        toggle();
    }

    const handleInputValue = useCallback((value: string) => {
        setInputValue(value);
        setSelected(null);
    }, [])

    useEffect(() => {
        if (fetchData && inputValue.length >= minLengthToFetch) {
            if (inputValue.length >= minLengthToFetch) {
                const loadOptions = async (value: string) => {
                    const options = await fetchData(value);
                    setFilteredOptions(options);
                }
                loadOptions(inputValue);
                if (!open) setOpen(true);
            } else {
                setFilteredOptions([]);
            }
        }
    }, [debounceSearch]);

    useEffect(() => {
        if (options) setFilteredOptions(options.filter(option => option && option[labelKey]?.toString().toLowerCase().includes(inputValue.toLowerCase())));
    }, [inputValue, open, options, labelKey, setFilteredOptions]);

    const handleClear = (event: React.MouseEvent<SVGSVGElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setSelected(null);
        setInputValue('');
        if (onChange) onChange(null);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const index = filteredOptions.indexOf(active || filteredOptions[0]);
        if (event.key === 'ArrowDown' && open && index < filteredOptions.length - 1) {
            setActive(filteredOptions[!active ? 0 : index + 1]);
        }
        if (event.key === 'ArrowUp' && open && index > 0) {
            setActive(filteredOptions[index - 1]);
        }
        if (event.key === 'Escape' && !active) {
            setOpen(false);
        }
        if (event.key === 'Escape' && active) {
            setActive(null);
        }
        if (event.key === 'Enter' && open && active) {
            handleSelect(active);
        }
    };

    const inputComponent = useMemo(() => (
        <>
            <FontAwesomeIcon icon={faSearch} />
            <div>
                {selected && <p className={'label-selected'}>{label}</p>}
                <input
                    type='text'
                    role='input'
                    className={selected ? 'input-selected input' : 'input'}
                    placeholder={label}
                    onChange={(e) => handleInputValue(e.target.value)}
                    value={selected ? selected[labelKey] : inputValue}
                />
            </div>
        </>
    ), [inputValue, label, selected, labelKey, handleInputValue]);

    const displayValueComponent = useMemo(() => (
        <>
            <p className={selected ? 'label-selected': 'label'}>{label}</p>
            <p className='value'>{selected && selected[labelKey]}</p>
        </>
    ), [selected, label, labelKey]);

    return (
        <div ref={ref} className={className}>
            <div onClick={!fetchData ? toggle : () => {}} role='select' tabIndex={0} className='select'>
                {autocomplete ? inputComponent : displayValueComponent}
                <div>
                    {clearable && <FontAwesomeIcon data-testid='clear' className='clear' icon={faClose} onClick={handleClear} />}
                    {!fetchData && <FontAwesomeIcon className={open ? 'caret caret-rotate' : 'caret'} icon={faChevronDown} />}
                </div>
            </div>
            {open && (
                <ul className='menu'>
                    {filteredOptions.map((option, index) => (
                        <li
                            key={index}
                            role='option'
                            className={selected === option ? 'selected' : (active === option ? 'active' : '')}
                            onClick={() => handleSelect(option)}
                        >
                            {option[labelKey]}
                        </li>
                    ))}
                    {!filteredOptions.length && <li>{noOptionsText}</li>}
                </ul>
            )}
        </div>
    );
}

export default BaseSelect;
