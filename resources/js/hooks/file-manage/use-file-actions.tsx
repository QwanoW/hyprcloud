import { router } from '@inertiajs/react';
import { toast } from 'sonner';

type FileUpdateOptions = {
    onSuccess?: () => void;
};

export function useFileActions() {
    const destroy = (ids: number[]) => {
        toast.loading('Deleting...', {
            id: 'deleting',
        });
        router.post(
            route('files.destroyMultiple'),
            {
                ids,
            },
            {
                onSuccess: () => {
                    toast.success('Successfully deleted', { id: 'deleting' });
                },
                onError: (errors) => {
                    toast.error('Failed to delete files', {
                        id: 'deleting',
                        description: Object.entries(errors)[0][1],
                    });
                },
            },
        );
    };

    const trash = (ids: number[]) => {
        toast.loading('Moving to trash...', {
            id: 'trash',
        });
        router.post(
            route('files.trashMultiple'),
            {
                ids,
            },
            {
                onSuccess: () => {
                    toast.success('Successfully moved to trash', { id: 'trash' });
                },
                onError: (errors) => {
                    toast.error('Failed to move to trash', {
                        id: 'trash',
                        description: Object.entries(errors)[0][1],
                    });
                },
            },
        );
    };
    const restore = (ids: number[]) => {
        toast.loading('Restoring file(s)...', {
            id: 'restore',
        });
        router.post(
            route('files.restoreMultiple'),
            {
                ids,
            },
            {
                onSuccess: () => {
                    toast.success('Successfully restored file(s)', { id: 'restore' });
                },
                onError: (errors) => {
                    toast.error('Failed to restore file(s)', {
                        id: 'restore',
                        description: Object.entries(errors)[0][1],
                    });
                },
            },
        );
    };

    const update = (id: number, data: { name?: string; trash?: boolean; shared?: boolean }, options?: FileUpdateOptions) => {
        toast.loading('Updating file...', {
            id: 'update',
        });
        router.put(route('files.update', id), data, {
            onSuccess: () => {
                toast.success('Successfully updated file(s)', { id: 'update' });
            },
            onError: (errors) => {
                toast.error('Failed to update file(s)', {
                    id: 'update',
                    description: Object.entries(errors)[0][1],
                });
            },
        });
    };

    return { destroy, trash, restore, update };
}
