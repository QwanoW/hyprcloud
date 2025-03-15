import { useEffect } from 'react';

interface RightClickMouseEvent extends MouseEvent {
    isRightClick?: boolean;
}

const useContextMenuSimulation = (
    container: HTMLElement | null,
    onRightClickSelectoItem?: (event: MouseEvent, fileItem: HTMLElement) => void
): void => {
    useEffect(() => {
        if (!container) return;

        const handleContextMenu = (e: MouseEvent): void => {
            e.preventDefault();
            const target = e.target as HTMLElement | null;
            if (!target) return;

            const fileItem = target.closest('.selecto-item') as HTMLElement | null;
            if (fileItem) {
                if (fileItem.classList.contains('active')) {
                    onRightClickSelectoItem?.(e, fileItem);
                    return;
                }

                const simulatedEvent: RightClickMouseEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    button: 0,
                    clientX: e.clientX,
                    clientY: e.clientY,
                });
                simulatedEvent.isRightClick = true;
                fileItem.dispatchEvent(simulatedEvent);

                onRightClickSelectoItem?.(e, fileItem);
            }
        };

        container.addEventListener('contextmenu', handleContextMenu);
        return () => {
            container.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [container, onRightClickSelectoItem]);
};

export default useContextMenuSimulation;
