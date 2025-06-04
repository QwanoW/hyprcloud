<?php

namespace Database\Seeders;

use App\Models\Plan;
use App\Models\PlanFeature;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        // Define feature groups and their implementations for each plan
        $featureGroups = [
            'storage' => [
                'Free' => ['name_en' => '2GB storage', 'name_ru' => '2 ГБ хранилище', 'popular' => true],
                'Basic' => ['name_en' => '100GB storage', 'name_ru' => '100 ГБ хранилище', 'popular' => true],
                'Pro' => ['name_en' => '1TB storage', 'name_ru' => '1 ТБ хранилище', 'popular' => true],
            ],
            'file_upload' => [
                'Free' => ['name_en' => '5MB file upload limit', 'name_ru' => 'Лимит загрузки файлов 5 МБ', 'popular' => false],
                'Basic' => ['name_en' => '15MB file upload limit', 'name_ru' => 'Лимит загрузки файлов 15 МБ', 'popular' => false],
                'Pro' => ['name_en' => '50MB file upload limit', 'name_ru' => 'Лимит загрузки файлов 50 МБ', 'popular' => false],
            ],
            'sharing' => [
                'Free' => ['name_en' => 'Basic sharing', 'name_ru' => 'Базовый обмен', 'popular' => true],
                'Basic' => ['name_en' => 'Standard sharing', 'name_ru' => 'Стандартный обмен', 'popular' => true],
                'Pro' => ['name_en' => 'Advanced sharing', 'name_ru' => 'Расширенный обмен', 'popular' => true],
            ],
            'support' => [
                'Free' => ['name_en' => 'Community support', 'name_ru' => 'Поддержка сообщества', 'popular' => true],
                'Basic' => ['name_en' => 'Email support', 'name_ru' => 'Поддержка по электронной почте', 'popular' => true],
                'Pro' => ['name_en' => 'Priority support', 'name_ru' => 'Приоритетная поддержка', 'popular' => true],
            ],
            'exports' => [
                'Free' => ['name_en' => 'Limited exports', 'name_ru' => 'Ограниченные экспорты', 'popular' => false],
                'Basic' => ['name_en' => 'Unlimited exports', 'name_ru' => 'Неограниченные экспорты', 'popular' => false],
                'Pro' => ['name_en' => 'Unlimited exports', 'name_ru' => 'Неограниченные экспорты', 'popular' => false],
            ],
            'versioning' => [
                'Free' => ['name_en' => 'File versioning (1 day)', 'name_ru' => 'Версионирование файлов (1 день)', 'popular' => false],
                'Basic' => ['name_en' => 'File versioning (30 days)', 'name_ru' => 'Версионирование файлов (30 дней)', 'popular' => false],
                'Pro' => ['name_en' => 'File versioning (unlimited)', 'name_ru' => 'Версионирование файлов (без ограничений)', 'popular' => false],
            ],
            'security' => [
                'Free' => ['name_en' => 'Standard security', 'name_ru' => 'Стандартная безопасность', 'popular' => false],
                'Basic' => ['name_en' => 'Enhanced security', 'name_ru' => 'Усиленная безопасность', 'popular' => false],
                'Pro' => ['name_en' => 'Enterprise-grade security', 'name_ru' => 'Корпоративный уровень безопасности', 'popular' => false],
            ],
            'mobile' => [
                'Free' => ['name_en' => 'Mobile app access', 'name_ru' => 'Доступ через мобильное приложение', 'popular' => false],
                'Basic' => ['name_en' => 'Mobile app access', 'name_ru' => 'Доступ через мобильное приложение', 'popular' => false],
                'Pro' => ['name_en' => 'Mobile app access', 'name_ru' => 'Доступ через мобильное приложение', 'popular' => false],
            ],
            'api' => [
                'Free' => ['name_en' => 'No API access', 'name_ru' => 'Нет доступа к API', 'popular' => false, 'included' => false],
                'Basic' => ['name_en' => 'Basic API access', 'name_ru' => 'Базовый доступ к API', 'popular' => false],
                'Pro' => ['name_en' => 'Full API access', 'name_ru' => 'Полный доступ к API', 'popular' => false],
            ],
            'integrations' => [
                'Free' => ['name_en' => 'No custom integrations', 'name_ru' => 'Нет пользовательских интеграций', 'popular' => false, 'included' => false],
                'Basic' => ['name_en' => 'Limited integrations', 'name_ru' => 'Ограниченные интеграции', 'popular' => false],
                'Pro' => ['name_en' => 'Custom integrations', 'name_ru' => 'Пользовательские интеграции', 'popular' => true],
            ],
            'team' => [
                'Free' => ['name_en' => 'No team collaboration', 'name_ru' => 'Нет командного сотрудничества', 'popular' => false, 'included' => false],
                'Basic' => ['name_en' => 'Team collaboration (up to 3)', 'name_ru' => 'Командное сотрудничество (до 3-х)', 'popular' => true],
                'Pro' => ['name_en' => 'Unlimited team collaboration', 'name_ru' => 'Неограниченное командное сотрудничество', 'popular' => false],
            ],
            'account_manager' => [
                'Free' => ['name_en' => 'No account manager', 'name_ru' => 'Нет менеджера аккаунта', 'popular' => false, 'included' => false],
                'Basic' => ['name_en' => 'No account manager', 'name_ru' => 'Нет менеджера аккаунта', 'popular' => false, 'included' => false],
                'Pro' => ['name_en' => 'Dedicated account manager', 'name_ru' => 'Персональный менеджер аккаунта', 'popular' => false],
            ],
        ];

        $plans = [
            [
                'name_en' => 'Free',
                'description_en' => 'Perfect for individuals just getting started',
                'name_ru' => 'Бесплатный',
                'description_ru' => 'Идеально для тех, кто только начинает',
                'icon' => '🎁',
                'monthly_usd_price' => 0,
                'yearly_usd_price' => 0,
                'popular' => false,
                'storage_limit_bytes' => 2 * 1024 * 1024 * 1024, // 2GB
                'max_file_size_bytes' => 50 * 1024 * 1024,
                'max_files_count' => 100,
                'can_share_files' => true,
                'can_download_zip' => false,
                'has_api_access' => false,
                'max_shared_links' => 5,
                'shared_link_expiry_days' => 7,
            ],
            [
                'name_en' => 'Basic',
                'description_en' => 'Great for professionals and small teams',
                'name_ru' => 'Базовый',
                'description_ru' => 'Отлично подходит для профессионалов и небольших команд',
                'icon' => '⚡',
                'monthly_usd_price' => 9,
                'yearly_usd_price' => 90,
                'popular' => true,
                'storage_limit_bytes' => 100 * 1024 * 1024 * 1024, // 100GB
                'max_file_size_bytes' => 1024 * 1024 * 1024,
                'max_files_count' => 1000,
                'can_share_files' => true,
                'can_download_zip' => true,
                'has_api_access' => true,
                'max_shared_links' => 50,
                'shared_link_expiry_days' => 30,
            ],
            [
                'name_en' => 'Pro',
                'description_en' => 'Full-featured plan for businesses of any size',
                'name_ru' => 'Профессиональный',
                'description_ru' => 'Полнофункциональный план для бизнеса любого масштаба',
                'icon' => '💎',
                'monthly_usd_price' => 19,
                'yearly_usd_price' => 190,
                'popular' => false,
                'storage_limit_bytes' => 1024 * 1024 * 1024 * 1024, // 1TB
                'max_file_size_bytes' => 100 * 1024 * 1024 * 1024,
                'max_files_count' => null, // unlimited
                'can_share_files' => true,
                'can_download_zip' => true,
                'has_api_access' => true,
                'max_shared_links' => null, // unlimited
                'shared_link_expiry_days' => null, // no expiry
            ],
        ];

        // Create plans and add features based on groups
        foreach ($plans as $planData) {
            $plan = Plan::create([
                'name_en' => $planData['name_en'],
                'description_en' => $planData['description_en'],
                'name_ru' => $planData['name_ru'],
                'description_ru' => $planData['description_ru'],
                'icon' => $planData['icon'],
                'monthly_usd_price' => $planData['monthly_usd_price'],
                'monthly_rub_price' => $planData['monthly_usd_price'] * 75,
                'yearly_usd_price' => $planData['yearly_usd_price'],
                'yearly_rub_price' => $planData['yearly_usd_price'] * 75,
                'popular' => $planData['popular'],
                'storage_limit_bytes' => $planData['storage_limit_bytes'],
                'max_file_size_bytes' => $planData['max_file_size_bytes'],
                'max_files_count' => $planData['max_files_count'],
                'can_share_files' => $planData['can_share_files'],
                'can_download_zip' => $planData['can_download_zip'],
                'has_api_access' => $planData['has_api_access'],
                'max_shared_links' => $planData['max_shared_links'],
                'shared_link_expiry_days' => $planData['shared_link_expiry_days'],
            ]);

            // Add features from each group to this plan
            foreach ($featureGroups as $groupKey => $groupFeatures) {
                $featureData = $groupFeatures[$planData['name_en']];

                // Set included to true by default unless explicitly set to false
                $included = isset($featureData['included']) ? $featureData['included'] : true;

                PlanFeature::create([
                    'name_ru'  => $featureData['name_ru'],
                    'name_en'  => $featureData['name_en'],
                    'plan_id'  => $plan->id,
                    'popular'  => $featureData['popular'],
                    'included' => $included,
                    'group'    => $groupKey,  // Add group identifier
                ]);
            }
        }
    }
}
