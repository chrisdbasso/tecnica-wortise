import { useCallback, useEffect, useState } from "react";

interface WindowSize {
	width: number;
	height: number;
}

type WindowSizeSelector<T> = (size: WindowSize) => T;

export function useWindowSize<T = WindowSize>(
	selector?: WindowSizeSelector<T>,
): T {
	const [windowSize, setWindowSize] = useState<WindowSize>({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const handleResize = useCallback(() => {
		setWindowSize({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	}, []);

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [handleResize]);

	if (selector) {
		return selector(windowSize);
	}

	return windowSize as T;
}
