import React, {FC, useState} from 'react';
import {Field, useField, useFormikContext} from 'formik';
import {BsChevronDown} from 'react-icons/bs';
import {FieldInputProps} from "formik/dist/types";

type OptionType = {
    value: string | number;
    label: string;
};

type AutocompleteProps<T> = {
    name: string;
    options: OptionType[];
    label?: string;
    startAdornment?: React.ReactNode;
    onChange?: (value: string | number) => void;
}

const SelectInput: FC<AutocompleteProps<any>> = ({name, options, label, startAdornment, onChange, }) => {
    const {setFieldValue} = useFormikContext();
    const [field, meta] = useField(name);
    const [showOptions, setShowOptions] = useState(false);

    const handleChange = (value: string | number) => {
        if (onChange) onChange(value);
        setFieldValue(name, value);
    };

    const handleSelectOption = (value: string | number) => {
        handleChange(value);
        setShowOptions(false);
    };

    return (
        <div className='w-full md:max-w-xs md:p-2 pb-4'>
            <label className='block text-gray-600 text-md mb-2'>{label}</label>
            <div className='relative'>
                {startAdornment && (
                    <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>{startAdornment}</div>
                )}
                <Field name={name}>
                    {({field, form, meta}: any) => {
                        return (
                            <input
                                {...field}
                                type='text'
                                autoComplete='off'
                                onFocus={() => setShowOptions(true)}
                                onBlur={() => setTimeout(() => setShowOptions(false), 200)}
                                className='w-full p-3 border rounded-lg border-gray-600 outline-none'
                            />
                        );
                    }}
                </Field>
                <BsChevronDown onClick={() => setShowOptions(!showOptions)}
                    className={`h-5 w-5 absolute right-3 top-1/3 transform ${
                        showOptions ? 'rotate-180' : 'rotate-0'
                    }`}
                />
                {showOptions && (
                    <ul className='absolute top-full left-0 w-full bg-white border rounded mt-2 z-50'>
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelectOption(option.value)}
                                className='px-4 py-2 cursor-pointer hover:bg-gray-100'
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
                {meta.touched && meta.error && <div className='text-red-600 absolute top-full left-0'>{meta.error}</div>}
            </div>
        </div>
    );
};

export default SelectInput;
