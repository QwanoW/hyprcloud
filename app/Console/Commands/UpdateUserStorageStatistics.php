<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class UpdateUserStorageStatistics extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:update-storage-stats {--force : Force update even if recently updated}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update storage statistics for all users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating storage statistics for all users...');
        
        $users = User::all();
        $progressBar = $this->output->createProgressBar($users->count());
        
        foreach ($users as $user) {
            if ($this->option('force') || !$user->storage_stats_updated_at || $user->storage_stats_updated_at->diffInHours(now()) > 1) {
                $user->updateStorageStatistics();
            }
            $progressBar->advance();
        }
        
        $progressBar->finish();
        $this->newLine();
        $this->info('Storage statistics updated successfully!');
        
        return Command::SUCCESS;
    }
}
