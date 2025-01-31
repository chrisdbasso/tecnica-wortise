import { useState } from 'react';

export const useAnchorElement = <T extends HTMLElement>() => {
    const [anchorEl, setAnchorEl] = useState<T | null>(null);

    const handleOpen = (event: React.MouseEvent<T>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return [
        { anchorEl, open: Boolean(anchorEl) },
        { handleOpen, handleClose },
    ] as const;
};
