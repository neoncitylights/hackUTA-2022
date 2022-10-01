import { ChevronDownIcon } from '@radix-ui/react-icons';
import { SelectIcon, SelectTrigger, SelectValue, Root } from '@radix-ui/react-select';
import React from 'react';

export function Select() {
    return (
        <Root>
            <SelectTrigger aria-label="Food">
                <SelectValue placeholder="Select a fruit…" />
                <SelectIcon>
                    <ChevronDownIcon />
                </SelectIcon>
            </SelectTrigger>
        </Root>
    );
}
