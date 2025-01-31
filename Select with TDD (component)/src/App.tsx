import React from 'react';
import './App.css';
import {Select} from 'components/selects/styles';
import {mockOptions} from 'components/selects/tests/mock-options';

// This is a demo of the select component
function App() {
    const fetchData = async (value: string) => {
        return mockOptions.filter(option => value && option.name.toLowerCase().includes(value.toLowerCase()));
    }

    return (
        <div className='container'>
            Simple select
            <Select options={mockOptions} labelKey='name' />
            Simple select with clearable
            <Select options={mockOptions} labelKey='name' clearable={true} />
            Select with autocomplete
            <Select options={mockOptions} labelKey='name' clearable={true} autocomplete={true} />
            Select with autocomplete and async data
            <Select labelKey='name' clearable={true} autocomplete={true} fetchData={fetchData} />
        </div>
    );
}

export default App;
