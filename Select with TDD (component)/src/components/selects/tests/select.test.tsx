import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {Select} from 'components/selects';
import {mockOptions} from './mock-options';
import userEvent from '@testing-library/user-event';

test('render options when select gains focus', () => {
    const component = render(<Select options={mockOptions} labelKey='name' />);

    userEvent.click(screen.getByRole('select'));
    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(mockOptions.length);
});

test('render options when select loses focus', () => {
    const component = render(<Select options={mockOptions} labelKey='name' />);

    userEvent.click(screen.getByRole('select'));
    userEvent.click(document.body)

    expect(screen.queryByRole('option')).toBeNull();
});

test('not show options when select an item', () => {
    const component = render(<Select options={mockOptions} labelKey='name' />);

    userEvent.click(screen.getByRole('select'));
    userEvent.click(screen.getByText(mockOptions[0].name));

    expect(screen.queryByRole('option')).toBeNull();
});

test('select an item', () => {
    const component = render(<Select options={mockOptions} labelKey='name' />);

    userEvent.click(screen.getByRole('select'));
    userEvent.click(screen.getByText(mockOptions[0].name));

    expect(screen.getByText(mockOptions[0].name)).toBeInTheDocument();
});

test('clear selected item', () => {
    const component = render(<Select options={mockOptions} labelKey='name' clearable={true} />);

    userEvent.click(screen.getByRole('select'));
    userEvent.click(screen.getByText(mockOptions[0].name));
    userEvent.click(screen.getByTestId('clear'));

    expect(screen.queryByText(mockOptions[0].name)).toBeNull();
});

test('select with autocomplete', () => {
    const component = render(<Select options={mockOptions} labelKey='name' autocomplete={true} />);
    const input = screen.getByRole('input');

    userEvent.click(screen.getByRole('select'));
    fireEvent.change(input, {target: {value: mockOptions[0].name}});
    const options = screen.getAllByRole('option');

    expect(options).toHaveLength(1);
});

test('fetchData when input changes', async () => {
    const fetchData = jest.fn().mockImplementation(async (value: string) => {
        return mockOptions.filter(option => value && option.name.toLowerCase().includes(value.toLowerCase()));
    });
    const component = render(<Select labelKey='name' autocomplete={true} fetchData={fetchData} />);
    const input = screen.getByRole('input');

    userEvent.click(screen.getByRole('select'));
    fireEvent.change(input, {target: {value: mockOptions[0].name}});

    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1), {timeout: 1000});
});

test('don\'t call fetchData if input value is less than minLengthToFetch', async () => {
    const fetchData = jest.fn().mockImplementation(async (value: string) => {
        return mockOptions.filter(option => value && option.name.toLowerCase().includes(value.toLowerCase()));
    });
    const component = render(<Select labelKey='name' autocomplete={true} fetchData={fetchData} minLengthToFetch={3} />);
    const input = screen.getByRole('input');

    userEvent.click(screen.getByRole('select'));
    fireEvent.change(input, {target: {value: 'aa'}});

    await waitFor(() => expect(fetchData).toBeCalledTimes(0), {timeout: 1000});
});

test('select option and call onChange', () => {
    const onChange = (value: any) => {
        expect(value).toBe(mockOptions[0]);
    }
    const component = render(<Select options={mockOptions} labelKey='name' onChange={onChange} />);

    userEvent.click(screen.getByRole('select'));
    userEvent.click(screen.getByText(mockOptions[0].name));
});

test('Hitting the "down arrow" key highlights the next option', () => {
    const component = render(<Select options={mockOptions} labelKey='name' />);
    userEvent.click(screen.getByRole('select'));

    mockOptions.forEach((option, index) => {
        fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowDown'});
        expect(screen.getByText(mockOptions[index].name)).toHaveClass('active');
    });
    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowDown'});
    expect(screen.getByText(mockOptions[mockOptions.length - 1].name)).toHaveClass('active');

});

test('Hitting the "up arrow" key highlights the previous option', () => {
    const component = render(<Select options={mockOptions} labelKey='name' />);
    userEvent.click(screen.getByRole('select'));

    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowDown'});

    expect(screen.getByText(mockOptions[2].name)).toHaveClass('active');
    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowUp'});
    expect(screen.getByText(mockOptions[1].name)).toHaveClass('active');
    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowUp'});
    expect(screen.getByText(mockOptions[0].name)).toHaveClass('active');
    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowUp'});
    expect(screen.getByText(mockOptions[0].name)).toHaveClass('active');
});

test('Hitting the "enter" key selects the highlighted option', () => {
    const component = render(<Select options={mockOptions} labelKey='name' />);
    userEvent.click(screen.getByRole('select'));

    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowDown'});
    fireEvent.keyDown(screen.getByRole('select'), {key: 'Enter'});

    expect(screen.getByText(mockOptions[2].name)).toBeInTheDocument();
});

test('Hitting the "esc" key closes the dropdown', () => {
    const component = render(<Select options={mockOptions} labelKey='name' />);

    userEvent.click(screen.getByRole('select'));
    fireEvent.keyDown(screen.getByRole('select'), {key: 'Escape'});

    expect(screen.queryByRole('option')).toBeNull();
});

test('Hitting  the "esc" key while exists a active option, clears the active option', () => {
    const component = render(<Select options={mockOptions} labelKey='name' />);

    userEvent.click(screen.getByRole('select'));
    fireEvent.keyDown(screen.getByRole('select'), {key: 'ArrowDown'});
    expect(screen.getByText(mockOptions[0].name)).toHaveClass('active');
    fireEvent.keyDown(screen.getByRole('select'), {key: 'Escape'});

    expect(screen.getByText(mockOptions[0].name)).not.toHaveClass('active');
});
