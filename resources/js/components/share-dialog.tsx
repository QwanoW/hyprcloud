import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Copy, Eye, EyeOff, Share2, Trash2, Settings, QrCode, Link, Download, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fileApi } from '@/services/fileApi';
import type { SharedLink, SharedData } from '@/types';
import { useLaravelReactI18n } from 'laravel-react-i18n';
import { usePage } from '@inertiajs/react';
import QRCode from 'react-qr-code';

interface ShareDialogProps {
  fileId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CreateSharedLinkData {
  file_id: number;
  password?: string;
  expires_at?: string;
  allow_download?: boolean;
}

interface UpdateSharedLinkData {
  password?: string;
  expires_at?: string;
  allow_download?: boolean;
  is_active?: boolean;
}

export function ShareDialog({ fileId, open, onOpenChange }: ShareDialogProps) {
  const { t } = useLaravelReactI18n();
  const { auth: { user: { plan } } } = usePage<SharedData>().props;
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>();
  const [allowDownload, setAllowDownload] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  
  const queryClient = useQueryClient();

  // Check if user can configure sharing
  const canConfigureSharing = plan.can_configure_sharing;
  const canShareFiles = plan.can_share_files;
  const maxSharedLinks = plan.max_shared_links;
  
  // Get current active shared links count for limit checking
  const { data: userSharedLinks = [] } = useQuery({
    queryKey: ['user-shared-links'],
    queryFn: () => fileApi.getUserSharedLinks(),
    enabled: open && maxSharedLinks !== null,
  });
  
  const activeLinksCount = userSharedLinks.filter((link: SharedLink) => link.is_active).length;
  const isAtMaxLimit = maxSharedLinks !== null && activeLinksCount >= maxSharedLinks;

  // Fetch existing shared links for this file
  const { data: sharedLinks = [], isLoading } = useQuery({
    queryKey: ['shared-links', fileId],
    queryFn: () => fileApi.getFileSharedLinks(fileId),
    enabled: open,
  });

  const existingLink = sharedLinks[0]; // Since we enforce single link per file

  // Initialize form state when existing link data changes
  useEffect(() => {
    if (existingLink) {
      setHasPassword(existingLink.password_protected);
      setAllowDownload(existingLink.allow_download);
      if (existingLink.expires_at) {
        setExpiryDate(new Date(existingLink.expires_at));
      } else {
        setExpiryDate(undefined);
      }
    } else {
      // Reset form when no existing link
      setPassword('');
      setHasPassword(false);
      setExpiryDate(undefined);
      setAllowDownload(true);
    }
  }, [existingLink]);

  // Create shared link mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateSharedLinkData) => {
      // If there's already a link, delete it first to enforce single link per file
      if (sharedLinks.length > 0) {
        return fileApi.deleteSharedLink(sharedLinks[0].id).then(() => 
          fileApi.createSharedLink(data)
        );
      }
      return fileApi.createSharedLink(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shared-links', fileId] });
      // Invalidate file queries to update shared status in UI
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['file', fileId] });
      // Copy to clipboard
      navigator.clipboard.writeText(data.shared_link.url);
      toast.success(t('file_manage.link_copied'));
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Failed to create share link';
      toast.error(errorMessage || t('file_manage.share_link_create_failed'));
    },
  });

  // Update shared link mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSharedLinkData }) => 
      fileApi.updateSharedLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-links', fileId] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success(t('file_manage.share_link_updated'));
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Failed to update share link';
      toast.error(errorMessage || t('file_manage.share_link_update_failed'));
    },
  });

  // Delete shared link mutation
  const deleteMutation = useMutation({
    mutationFn: (linkId: number) => fileApi.deleteSharedLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared-links', fileId] });
      // Invalidate file queries to update shared status in UI
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['file', fileId] });
      toast.success(t('file_manage.share_link_deleted'));
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { error?: string } } }).response?.data?.error 
        : 'Failed to delete share link';
      toast.error(errorMessage || t('file_manage.share_link_delete_failed'));
    },
  });

  const handleCreateShare = () => {
    const data: CreateSharedLinkData = {
      file_id: fileId,
      allow_download: allowDownload,
    };

    if (hasPassword && password.trim()) {
      data.password = password;
    }

    if (expiryDate) {
      data.expires_at = expiryDate.toISOString();
    }

    createMutation.mutate(data);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success(t('file_manage.link_copied'));
  };

  const handleToggleActive = (sharedLink: SharedLink) => {
    updateMutation.mutate({
      id: sharedLink.id,
      data: { is_active: !sharedLink.is_active },
    });
  };

  const handleDeleteLink = (id: number) => {
    deleteMutation.mutate(id);
  };



  // Don't show dialog if user can't share files
  if (!canShareFiles) {
    return null;
  }



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            {t('file_manage.share_file')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">{t('file_manage.loading')}</p>
            </div>
          ) : (
            <>
              {!canShareFiles ? (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('file_manage.sharing_not_available')}</h3>
                  <p className="text-muted-foreground mb-4">{t('file_manage.upgrade_plan_to_share')}</p>
                </div>
              ) : isAtMaxLimit && !existingLink ? (
                <div className="text-center py-8">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">{t('file_manage.shared_links_limit_reached')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('file_manage.shared_links_limit_description', { max: maxSharedLinks, current: activeLinksCount })}
                  </p>
                </div>
              ) : existingLink ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      {t('file_manage.shared_link')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        existingLink.is_active 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      )}>
                        {existingLink.is_active ? t('file_manage.active') : t('file_manage.inactive')}
                      </span>
                    </div>
                  </div>

                  {/* Link details */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">{t('file_manage.access_count')}:</span>
                        <span className="ml-2 font-medium">{existingLink.access_count}</span>
                      </div>
                      {existingLink.expires_at && (
                        <div>
                          <span className="text-muted-foreground">{t('file_manage.expires')}:</span>
                          <span className="ml-2 font-medium">{format(new Date(existingLink.expires_at), 'PPP')}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">{t('file_manage.password')}:</span>
                        <span className="ml-2 font-medium">
                           {existingLink.password_protected ? t('file_manage.protected') : t('file_manage.none')}
                         </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">{t('file_manage.downloads')}:</span>
                        <span className="ml-2 font-medium">
                          {existingLink.allow_download ? t('file_manage.allowed') : t('file_manage.disabled')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Main action buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Large copy button */}
                    <Button
                      onClick={() => handleCopyLink(existingLink.url)}
                      className="h-12 text-base font-medium"
                      size="lg"
                    >
                      <Copy className="h-5 w-5 mr-2" />
                      {t('file_manage.copy_link')}
                    </Button>

                    {/* QR Code toggle */}
                    <Button
                      onClick={() => setShowQrCode(!showQrCode)}
                      variant="outline"
                      className="h-12 text-base font-medium"
                      size="lg"
                    >
                      <QrCode className="h-5 w-5 mr-2" />
                      {showQrCode ? t('file_manage.hide_qr') : t('file_manage.show_qr')}
                    </Button>
                  </div>

                  {/* QR Code display */}
                  {showQrCode && (
                    <div className="flex justify-center p-6 bg-white rounded-lg border">
                      <div className="text-center space-y-3">
                        <QRCode
                          value={existingLink.url}
                          size={200}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        />
                        <p className="text-sm text-muted-foreground">{t('file_manage.scan_qr_code')}</p>
                      </div>
                    </div>
                  )}

                  {/* Management buttons */}
                  {/* Кнопка активации/деактивации позволяет временно отключить ссылку без её удаления.
                       Неактивная ссылка не работает, но сохраняет все настройки (пароль, срок действия). */}
                   <div className="flex flex-wrap gap-2">
                     <Button
                       onClick={() => handleToggleActive(existingLink)}
                       variant="outline"
                       size="sm"
                       disabled={updateMutation.isPending}
                     >
                       {existingLink.is_active ? (
                         <>
                           <EyeOff className="h-4 w-4 mr-2" />
                           {t('file_manage.deactivate')}
                         </>
                       ) : (
                         <>
                           <Eye className="h-4 w-4 mr-2" />
                           {t('file_manage.activate')}
                         </>
                       )}
                     </Button>

                    {canConfigureSharing && (
                      <Button
                        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                        variant="outline"
                        size="sm"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t('file_manage.settings')}
                      </Button>
                    )}

                    <Button
                      onClick={() => handleDeleteLink(existingLink.id)}
                      variant="destructive"
                      size="sm"
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('file_manage.delete_link')}
                    </Button>
                  </div>
                </div>
              ) : (
                /* No existing link - show create form */
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <h3 className="text-lg font-semibold mb-2">{t('file_manage.no_shared_link')}</h3>
                    <p className="text-muted-foreground">{t('file_manage.create_link_description')}</p>
                  </div>

                  {/* Quick create button */}
                  <Button
                    onClick={() => handleCreateShare()}
                    disabled={createMutation.isPending || isAtMaxLimit}
                    className="w-full h-12 text-base font-medium"
                    size="lg"
                  >
                    <Link className="h-5 w-5 mr-2" />
                    {createMutation.isPending ? t('file_manage.creating') : t('file_manage.create_shared_link')}
                  </Button>
                  
                  {isAtMaxLimit && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      {t('file_manage.shared_links_limit_reached')}
                    </p>
                  )}

                  {/* Advanced settings toggle */}
                  {canConfigureSharing && (
                    <Button
                      onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                      variant="outline"
                      className="w-full"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {showAdvancedSettings ? t('file_manage.hide_advanced') : t('file_manage.show_advanced')}
                    </Button>
                  )}
                </div>
              )}

              {/* Advanced settings (only if user can configure sharing) */}
              {canConfigureSharing && showAdvancedSettings && (
                <div className="border-t pt-4 space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {t('file_manage.advanced_settings')}
                  </h4>
                  
                  <div className="space-y-4">
                    {/* Password protection */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password-protection">{t('file_manage.password_protection')}</Label>
                        <Switch
                          id="password-protection"
                          checked={hasPassword}
                          onCheckedChange={(checked) => {
                            setHasPassword(checked);
                            if (!checked) {
                              setPassword('');
                            }
                          }}
                        />
                      </div>
                      {hasPassword && (
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={existingLink?.password_protected ? t('file_manage.enter_new_password') : t('file_manage.enter_password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      )}
                      {existingLink?.password_protected && hasPassword && (
                        <p className="text-xs text-muted-foreground">
                          {t('file_manage.leave_empty_keep_current')}
                        </p>
                      )}
                    </div>

                    {/* Expiry date */}
                    <div className="space-y-2">
                      <Label>{t('file_manage.expiry_date')}</Label>
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !expiryDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expiryDate ? format(expiryDate, 'PPP') : t('file_manage.pick_date')}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={expiryDate}
                            onSelect={(date) => {
                              setExpiryDate(date);
                              setCalendarOpen(false);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {expiryDate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpiryDate(undefined)}
                          className="text-xs"
                        >
                          {t('file_manage.clear_date')}
                        </Button>
                      )}
                    </div>

                    {/* Allow download */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allow-download" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        {t('file_manage.allow_download')}
                      </Label>
                      <Switch
                        id="allow-download"
                        checked={allowDownload}
                        onCheckedChange={setAllowDownload}
                      />
                    </div>
                  </div>

                  {/* Apply settings button (only shown when editing existing link) */}
                  {existingLink && (
                    <Button
                      onClick={() => {
                        // Update existing link with new settings
                        const updateData: UpdateSharedLinkData = {
                          allow_download: allowDownload,
                          expires_at: expiryDate ? expiryDate.toISOString() : undefined,
                        };
                        
                        // Only include password if hasPassword is true
                        if (hasPassword) {
                          // If password field is not empty, use it; otherwise keep existing password
                          if (password.trim()) {
                            updateData.password = password;
                          }
                        } else {
                          // If password protection is disabled, clear the password
                          updateData.password = undefined;
                        }
                        
                        updateMutation.mutate({ id: existingLink.id, data: updateData });
                      }}
                      disabled={updateMutation.isPending}
                      className="w-full"
                    >
                      {updateMutation.isPending ? t('file_manage.updating') : t('file_manage.update_settings')}
                    </Button>
                  )}
                </div>
              )}

              {/* Plan limitation notice */}
              {!canConfigureSharing && (
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('file_manage.upgrade_for_advanced_sharing')}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}