import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '../Shared/AlertDialog';

import { TenantService } from '@abpreact/proxy';
import { useToast } from '../Shared/hooks/useToast';
import { useEffect, useState } from 'react';

type DeleteTenantProps = {
    tenant: { tenantId: string; tenantName: string };
    onDismiss: () => void;
};
export const DeleteTenant = ({
    tenant: { tenantId, tenantName },
    onDismiss
}: DeleteTenantProps) => {
    const { toast } = useToast();
    const [open, setOpen] = useState<boolean>(false);

    const onYesEvent = async () => {
        try {
            await TenantService.tenantDelete(tenantId);
            toast({
                title: 'Success',
                description: `Tenant "${tenantName}" has been deleted successfully.`
            });
            onDismiss();
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast({
                    title: 'Failed',
                    description: `There was a problem when deleting the role ${tenantName}. Kindly try again.`,
                    variant: 'destructive'
                });
            }
        }
    };

    useEffect(() => {
        setOpen(true);
    }, []);

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your tenant name "{tenantName}"
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onDismiss}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={onYesEvent}>
                        Yes
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
