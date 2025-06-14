import { useQueryClient } from '@tanstack/react-query';
import { router } from '@inertiajs/react';

export function useLogout() {
    const queryClient = useQueryClient();

    const logout = () => {
        // Clear all TanStack Query cache before logout
        queryClient.clear();
        
        // Perform logout
        router.post(route('logout'));
    };

    return logout;
}