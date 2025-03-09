import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';

export function NotificationButton() {
    return (
        <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
        </Button>
    )
}
