import { ShareToastContent } from '@/components/share-toast-content';
import { SharedData } from '@/types';
import { RequestPayload } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { RouteParams } from 'ziggy-js';

function performAction(routeName: string, payload: RequestPayload, loadingMsg?: string, successMsg?: string | React.ReactNode, method: 'post' | 'put' = 'post', routeParams?: RouteParams<string>) {
    loadingMsg && toast.loading(loadingMsg, { id: loadingMsg });
    const routerMethod = method === "post"
        ? router.post.bind(router)
        : router.put.bind(router);

    routerMethod(route(routeName, routeParams), payload, {
        onSuccess: () => {
            successMsg && toast.success(successMsg, { id: loadingMsg });
        },
        onError: (errors) => {
            successMsg && toast.error('Action failed', {
                id: loadingMsg,
                description: Object.entries(errors)[0][1],
            });
        },
    });
}

export function useFileActions() {
    const destroy = (ids: number[]) => performAction('files.destroyPermanentlyMultiple', { ids }, 'Deleting...', 'Successfully deleted');
    const trash = (ids: number[]) => performAction('files.destroyMultiple', { ids }, 'Moving to trash...', 'Successfully moved to trash');
    const restore = (ids: number[]) => performAction('files.restoreMultiple', { ids }, 'Restoring file(s)...', 'Successfully restored file(s)');
    const share = (id: number, userId: number) => {
        const link = `${window.location.origin}/shared/${userId}/${id}`;
        
        performAction(
            'files.update',
            { shared: true },
            'Sharing file...',
            <ShareToastContent link={link} />,
            'put',
            { id }
        );
    }
    const cancelShare = (id: number) => performAction('files.update', { shared: false }, undefined, undefined, 'put', { id })
    return { destroy, trash, restore, share, cancelShare };
}
