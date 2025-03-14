import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Grid3x3, TableOfContents } from 'lucide-react';

type ViewModeSwitcherProps = {
    className?: string;
    viewMode: 'list' | 'cards';
    onViewModeChange: (mode: 'list' | 'cards') => void;
};

export function ViewModeSwitcher({ viewMode, onViewModeChange, className = '' }: ViewModeSwitcherProps) {
    return (
        <ButtonGroup className={className}>
            <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => onViewModeChange('list')}
            >
                <TableOfContents />
            </Button>
            <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                onClick={() => onViewModeChange('cards')}
            >
                <Grid3x3 />
            </Button>
        </ButtonGroup>
    );
}
