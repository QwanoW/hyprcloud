import { RequestPayload } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { RouteParams } from 'ziggy-js';

function performAction(loadingMsg: string, routeName: string, payload: RequestPayload, successMsg: string, method: 'post' | 'put' = 'post', routeParams?: RouteParams<string> ) {
    toast.loading(loadingMsg, { id: loadingMsg });
    const routerMethod = method === "post"
        ? router.post.bind(router)
        : router.put.bind(router);

    routerMethod(route(routeName, routeParams), payload, {
        onSuccess: () => {
            toast.success(successMsg, { id: loadingMsg });
        },
        onError: (errors) => {
            toast.error('Action failed', {
                id: loadingMsg,
                description: Object.entries(errors)[0][1],
            });
        },
    });
}

export function useFileActions() {
    const destroy = (ids: number[]) => performAction('Deleting...', 'files.destroyPermanentlyMultiple', { ids }, 'Successfully deleted');
    const trash = (ids: number[]) => performAction('Moving to trash...', 'files.destroyMultiple', { ids }, 'Successfully moved to trash');
    const restore = (ids: number[]) => performAction('Restoring file(s)...', 'files.restoreMultiple', { ids }, 'Successfully restored file(s)');
    const share = (id: number) => performAction('Sharing file...', 'files.update', {shared: true}, 'Successfully shared file', 'put', {id})
    const cancelShare = (id: number) => performAction('Cancelling share...', 'files.update', {shared: false}, 'Successfully cancelled share', 'put', {id})
    return { destroy, trash, restore, share, cancelShare };
}
