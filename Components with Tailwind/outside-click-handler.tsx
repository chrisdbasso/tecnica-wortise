import React, { FC, useEffect, useRef } from 'react';

type OutsideClickHandlerProps = {
    onOutsideClick: () => void;
    children: React.ReactElement;
    className: string;
  }

const OutsideClickHandler: FC<OutsideClickHandlerProps> = ({ onOutsideClick, children, className }) => {
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                onOutsideClick();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

    }, [onOutsideClick]);
    return <div className={className} ref={wrapperRef}>{children}</div>;
};

export default OutsideClickHandler;