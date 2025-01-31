import React, {FC, useState, useRef, useEffect} from 'react';
import {Field, useField, useFormikContext} from 'formik';
import {BsCheck, BsChevronDown} from 'react-icons/bs';
import {FieldInputProps} from "formik/dist/types";
import OutsideClickHandler from './outside-click-handler';

type OptionType = {
    value: string | number;
    label: string;
};

type SelectInputMultipleProps<T> = {
    name: string;
    options: OptionType[];
    label?: string;
    onChange?: (value: string) => void;
}

const SelectInputMultiple: FC<SelectInputMultipleProps<any>> = ({name, options, label }) => {
    const {setFieldValue} = useFormikContext();
    const [field, meta] = useField(name);
    const [showOptions, setShowOptions] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleWindowClick = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        };

        if (showOptions) {
            window.addEventListener('click', handleWindowClick);
        }

        return () => {
            window.removeEventListener('click', handleWindowClick);
        };
    }, [showOptions]);

    const handleChange = (value: string | number) => {
        if (field.value.includes(value)) {
            setFieldValue(name, field.value.filter((item: string | number) => item !== value));
            return;
        } else {
            setFieldValue(name, field.value.concat(value));
        }
    };

    const handleSelectOption = (option: OptionType) => {
        handleChange(option.value);
    };

    return (
        <OutsideClickHandler
            onOutsideClick={() => setShowOptions(false)}
            className='w-full md:max-w-xs md:p-2 pb-4'
        >
            <>
                <label className='block text-gray-600 text-md mb-2'>{label}</label>
                <div className='relative'>
                    <Field name={name}>
                        {({field, form, meta}: any) => {
                            return (
                                <input
                                    {...field}
                                    value={options.filter(option => field.value.includes(option.value)).map(option => option.label).join(', ')}
                                    type='text'
                                    autoComplete='off'
                                    onFocus={() => setShowOptions(true)}
                                    //onBlur={() => setTimeout(() => setShowOptions(false), 200)}
                                    className='w-full p-3 border rounded-lg border-gray-600 outline-none'
                                />
                            );
                        }}
                    </Field>
                    {field.value.length > 0 && (
                        <div className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-white pl-1'>
                            <div className='bg-primary-light rounded-full h-6 w-6 flex items-center justify-center mr-6'>
                                <span className='text-white text-sm'>{field.value.length}</span>
                            </div>
                        </div>
                    )}
                    <BsChevronDown onClick={() => setShowOptions(!showOptions)}
                        className={`h-5 w-5 absolute right-3 top-1/3 transform bg-white ${
                            showOptions ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                    {showOptions && (
                        <ul className='absolute top-full left-0 w-full bg-white border rounded mt-2 z-50 max-h-[25rem] overflow-y-auto'>
                            {options.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelectOption(option)}
                                    className={'px-4 py-2 cursor-pointer hover:bg-gray-100' + (field.value.includes(option.value) ? ' bg-gray-300' : '')}
                                >
                                    {field.value.includes(option.value) && <BsCheck className='inline-block mr-2' color='#5F7CEB' size={20} />}
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    )}
                    {meta.touched && meta.error && <div className='text-red-600 absolute top-full left-0'>{meta.error}</div>}
                </div>
            </>
        </OutsideClickHandler>
    );
};

export default SelectInputMultiple;
