import styled from 'styled-components';
import BaseSelect from 'components/selects/select';
import {colors, shape} from 'theme';

export const Select = styled(BaseSelect)`
    position: relative;
    margin: 2em;
    min-width: 260px;
    opacity: ${props => props.disabled ? 0.7 : 1};
    pointer-events: ${props => props.disabled ? 'none' : 'auto'};
    .select {
        display: flex;
        height: 50px;
        border: 2px solid ${colors.secondary.main};
        border-radius: ${shape};
        align-items: center;
        padding-left: 0.5em;
        padding-right: 0.5em;
        justify-content: space-between;
        cursor: pointer;
        transition: background 0.3s
    }
    .select:hover {
        background: ${colors.background.main};
        border: 2px solid ${colors.primary.main};
    }
    .value {
        padding-top: 0.8em;
    }
    .label {
        margin-right: 0.5em;
        color: ${colors.secondary.main};
    }
    .label-selected {
        position: absolute;
        top: 0;
        font-weight: 600;
        font-size: 0.625em;
        transition: 0.2s;
        color: ${colors.secondary.main};
    }
    .clear {
        margin: 0 0.3em 0 0.3em;
        color: ${colors.secondary.main};
    }
    .caret {
        margin: 0 0.3em 0 0.3em;
        color: ${colors.primary.main};
    }
    .caret-rotate {
        transform: rotate(180deg);
    }
    .menu {
        list-style: none;
        box-sizing: border-box;
        padding: 0.2em 0 0 0;
        box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.1);
        border-radius: ${shape};
        position: absolute;
        top: 3em;
        left: 50%;
        width: 100%;
        background: ${colors.background.main};
        transform: translateX(-50%);
        transition: 0.2s;
        z-index: 1;
    }
    .menu li {
        padding: 1em;
        margin: 0 0;
        cursor: pointer;
        color: ${colors.secondary.main};
    }
    .menu li:hover {
        background: ${colors.secondary.light};
    }
    .selected {
        color: ${colors.primary.main} !important;
        border-left: 3px solid ${colors.primary.main};
        background: ${colors.secondary.light};
    }
    .input {
        border: none;
        outline: none;
        background: transparent;
        height: 100%;
        font-size: 1em;
    }
    .input-selected {
        padding-top: 0.8em;
    }
    .active {
        background: ${colors.secondary.light};
    }
`;
