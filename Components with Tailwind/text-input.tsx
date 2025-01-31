import React, { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
}

const TextInput: React.FC<TextInputProps> = ({ label, startAdornment, endAdornment, ...inputProps }) => {

    return (
        <div className='flex flex-col md:p-1 pb-4'>
            <label className='text-md mb-2 text-gray-600'>{label}</label>
            <div className='relative flex flex-col'>
                {startAdornment && <div className='absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600'>{startAdornment}</div>}
                <input
                    className='px-3 py-3 rounded-lg border border-gray-600 outline-none pl-8'
                    {...inputProps}
                />
                {endAdornment && <div className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600'>{endAdornment}</div>}
            </div>
        </div>
    );
};

export default TextInput;
