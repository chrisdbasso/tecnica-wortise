import {MouseEvent, useCallback, useState} from 'react';

export const useToggle = (initialValue: boolean = false) => {
    const [state, setState] = useState(initialValue);

    const toggle = useCallback(
        (value?: boolean | MouseEvent | unknown) =>
            setState((curr) => (value !== undefined && typeof value === 'boolean' ? value : !curr)),
        []
    );
    const setOpen = useCallback(() => setState(true), []);
    const setClose = useCallback(() => setState(false), []);

    return [state, {toggle, setOpen, setClose}] as const;
};

export type UseToogleReturn = ReturnType<typeof useToggle>;
export type UseToggleState = UseToogleReturn[0];
export type UseToggleActions = UseToogleReturn[1];
