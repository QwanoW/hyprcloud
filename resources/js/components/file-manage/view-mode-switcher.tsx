import React from 'react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Grid3x3, TableOfContents } from 'lucide-react';

type ViewModeSwitcherProps = {
    viewMode: 'list' | 'cards';
    onViewModeChange: (mode: 'list' | 'cards') => void;
};

export function ViewModeSwitcher({ viewMode, onViewModeChange }: ViewModeSwitcherProps) {
    return (
        <ButtonGroup>
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
