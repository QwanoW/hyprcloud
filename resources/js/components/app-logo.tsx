import { Cloud } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary dark:bg-white text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <Cloud className="size-5 fill-current text-white dark:text-blue-600" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Hyprcloud</span>
            </div>
        </>
    );
}
