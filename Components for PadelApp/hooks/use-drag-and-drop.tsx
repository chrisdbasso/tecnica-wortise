import { DragEventHandler, useState } from 'react';

export default function useDragAndDrop() {
    const [dragOver, setDragOver] = useState(false);
    const [fileDropError, setFileDropError] = useState<string[]>([]);

    const onDragOver: DragEventHandler<HTMLDivElement> | undefined = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const onDragLeave: DragEventHandler<HTMLDivElement> | undefined = () => setDragOver(false);

    return {
        dragOver,
        setDragOver,
        onDragOver,
        onDragLeave,
        fileDropError,
        setFileDropError,
    };
}
