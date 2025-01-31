import { type Theme, useMediaQuery } from "@mui/material";

export const useMobile = () => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
    return isMobile;
};
