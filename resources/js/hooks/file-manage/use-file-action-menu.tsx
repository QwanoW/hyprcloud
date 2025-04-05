import React, { useState, useEffect } from 'react';

export const useFileActionMenu = (containerRef: React.RefObject<HTMLElement | null>) => {
    const [actionMenuOpen, setActionMenuOpen] = useState(false);
    const [actionMenuPos, setActionMenuPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleContextMenu = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const fileItem = target.closest('.selecto-item') as HTMLElement;
            if (!fileItem) return;
            e.preventDefault();
            if (!fileItem.classList.contains('active')) {
                const simulatedEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    button: 0,
                    clientX: e.clientX,
                    clientY: e.clientY
                }) as MouseEvent & { isRightClick: boolean };
                simulatedEvent.isRightClick = true;
                fileItem.dispatchEvent(simulatedEvent);
            }
            setActionMenuPos({ x: e.clientX, y: e.clientY });
            setActionMenuOpen(true);
        };
        container.addEventListener('contextmenu', handleContextMenu);
        return () => container.removeEventListener('contextmenu', handleContextMenu);
    }, [containerRef]);

    return { actionMenuOpen, setActionMenuOpen, actionMenuPos };
};
