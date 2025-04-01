import { useCallback, useState } from 'react';

export const useFileSelection = () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSelect = useCallback((id: number, type: 'select' | 'unselect') => {
        if (type === 'select') {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(_id => _id !== id));
        }
    }, []);

    return { selectedIds, handleSelect };
};
