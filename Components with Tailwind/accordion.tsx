import React, {FC, useState} from 'react';
import {BsChevronDown} from 'react-icons/bs';

interface AccordionProps {
    title: string;
    defaultOpen?: boolean;
    children?: React.ReactNode;
}

const Accordion: FC<AccordionProps> = ({title, defaultOpen, children, }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='border rounded-md'>
            <div className='flex flex-row p-4 cursor-pointer flex justify-between items-center' onClick={toggleAccordion}>
                <span className='text-lg font-semibold text-primary ml-1'>{title}</span>
                <BsChevronDown color='#5F7CEB' size={20} onClick={() => setIsOpen(!isOpen)}
                    className={`transform  ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                />
            </div>
            {isOpen && <div className='p-5 pt-0'>{children}</div>}
        </div>
    );
};

export default Accordion;
