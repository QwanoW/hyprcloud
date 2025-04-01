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
                'Free' => ['en_name' => '2GB storage', 'ru_name' => '2 ГБ хранилище', 'popular' => true],
                'Basic' => ['en_name' => '100GB storage', 'ru_name' => '100 ГБ хранилище', 'popular' => true],
                'Pro' => ['en_name' => '1TB storage', 'ru_name' => '1 ТБ хранилище', 'popular' => true],
            ],
            'file_upload' => [
                'Free' => ['en_name' => '5MB file upload limit', 'ru_name' => 'Лимит загрузки файлов 5 МБ', 'popular' => false],
                'Basic' => ['en_name' => '15MB file upload limit', 'ru_name' => 'Лимит загрузки файлов 15 МБ', 'popular' => false],
                'Pro' => ['en_name' => '50MB file upload limit', 'ru_name' => 'Лимит загрузки файлов 50 МБ', 'popular' => false],
            ],
            'sharing' => [
                'Free' => ['en_name' => 'Basic sharing', 'ru_name' => 'Базовый обмен', 'popular' => true],
                'Basic' => ['en_name' => 'Standard sharing', 'ru_name' => 'Стандартный обмен', 'popular' => true],
                'Pro' => ['en_name' => 'Advanced sharing', 'ru_name' => 'Расширенный обмен', 'popular' => true],
            ],
            'support' => [
                'Free' => ['en_name' => 'Community support', 'ru_name' => 'Поддержка сообщества', 'popular' => true],
                'Basic' => ['en_name' => 'Email support', 'ru_name' => 'Поддержка по электронной почте', 'popular' => true],
                'Pro' => ['en_name' => 'Priority support', 'ru_name' => 'Приоритетная поддержка', 'popular' => true],
            ],
            'exports' => [
                'Free' => ['en_name' => 'Limited exports', 'ru_name' => 'Ограниченные экспорты', 'popular' => false],
                'Basic' => ['en_name' => 'Unlimited exports', 'ru_name' => 'Неограниченные экспорты', 'popular' => false],
                'Pro' => ['en_name' => 'Unlimited exports', 'ru_name' => 'Неограниченные экспорты', 'popular' => false],
            ],
            'versioning' => [
                'Free' => ['en_name' => 'File versioning (1 day)', 'ru_name' => 'Версионирование файлов (1 день)', 'popular' => false],
                'Basic' => ['en_name' => 'File versioning (30 days)', 'ru_name' => 'Версионирование файлов (30 дней)', 'popular' => false],
                'Pro' => ['en_name' => 'File versioning (unlimited)', 'ru_name' => 'Версионирование файлов (без ограничений)', 'popular' => false],
            ],
            'security' => [
                'Free' => ['en_name' => 'Standard security', 'ru_name' => 'Стандартная безопасность', 'popular' => false],
                'Basic' => ['en_name' => 'Enhanced security', 'ru_name' => 'Усиленная безопасность', 'popular' => false],
                'Pro' => ['en_name' => 'Enterprise-grade security', 'ru_name' => 'Корпоративный уровень безопасности', 'popular' => false],
            ],
            'mobile' => [
                'Free' => ['en_name' => 'Mobile app access', 'ru_name' => 'Доступ через мобильное приложение', 'popular' => false],
                'Basic' => ['en_name' => 'Mobile app access', 'ru_name' => 'Доступ через мобильное приложение', 'popular' => false],
                'Pro' => ['en_name' => 'Mobile app access', 'ru_name' => 'Доступ через мобильное приложение', 'popular' => false],
            ],
            'api' => [
                'Free' => ['en_name' => 'No API access', 'ru_name' => 'Нет доступа к API', 'popular' => false, 'included' => false],
                'Basic' => ['en_name' => 'Basic API access', 'ru_name' => 'Базовый доступ к API', 'popular' => false],
                'Pro' => ['en_name' => 'Full API access', 'ru_name' => 'Полный доступ к API', 'popular' => false],
            ],
            'integrations' => [
                'Free' => ['en_name' => 'No custom integrations', 'ru_name' => 'Нет пользовательских интеграций', 'popular' => false, 'included' => false],
                'Basic' => ['en_name' => 'Limited integrations', 'ru_name' => 'Ограниченные интеграции', 'popular' => false],
                'Pro' => ['en_name' => 'Custom integrations', 'ru_name' => 'Пользовательские интеграции', 'popular' => true],
            ],
            'team' => [
                'Free' => ['en_name' => 'No team collaboration', 'ru_name' => 'Нет командного сотрудничества', 'popular' => false, 'included' => false],
                'Basic' => ['en_name' => 'Team collaboration (up to 3)', 'ru_name' => 'Командное сотрудничество (до 3-х)', 'popular' => true],
                'Pro' => ['en_name' => 'Unlimited team collaboration', 'ru_name' => 'Неограниченное командное сотрудничество', 'popular' => false],
            ],
            'account_manager' => [
                'Free' => ['en_name' => 'No account manager', 'ru_name' => 'Нет менеджера аккаунта', 'popular' => false, 'included' => false],
                'Basic' => ['en_name' => 'No account manager', 'ru_name' => 'Нет менеджера аккаунта', 'popular' => false, 'included' => false],
                'Pro' => ['en_name' => 'Dedicated account manager', 'ru_name' => 'Персональный менеджер аккаунта', 'popular' => false],
            ],
        ];

        $plans = [
            [
                'en_name' => 'Free',
                'en_description' => 'Perfect for individuals just getting started',
                'ru_name' => 'Бесплатный',
                'ru_description' => 'Идеально для тех, кто только начинает',
                'icon' => '🎁',
                'monthly_usd_price' => 0,
                'yearly_usd_price' => 0,
                'popular' => false,
            ],
            [
                'en_name' => 'Basic',
                'en_description' => 'Great for professionals and small teams',
                'ru_name' => 'Базовый',
                'ru_description' => 'Отлично подходит для профессионалов и небольших команд',
                'icon' => '⚡',
                'monthly_usd_price' => 9,
                'yearly_usd_price' => 90,
                'popular' => true,
            ],
            [
                'en_name' => 'Pro',
                'en_description' => 'Full-featured plan for businesses of any size',
                'ru_name' => 'Профессиональный',
                'ru_description' => 'Полнофункциональный план для бизнеса любого масштаба',
                'icon' => '💎',
                'monthly_usd_price' => 19,
                'yearly_usd_price' => 190,
                'popular' => false,
            ],
        ];

        // Create plans and add features based on groups
        foreach ($plans as $planData) {
            $plan = Plan::create([
                'en_name' => $planData['en_name'],
                'en_description' => $planData['en_description'],
                'ru_name' => $planData['ru_name'],
                'ru_description' => $planData['ru_description'],
                'icon' => $planData['icon'],
                'monthly_usd_price' => $planData['monthly_usd_price'],
                'monthly_rub_price' => $planData['monthly_usd_price'] * 75,
                'yearly_usd_price' => $planData['yearly_usd_price'],
                'yearly_rub_price' => $planData['yearly_usd_price'] * 75,
                'popular' => $planData['popular'],
            ]);

            // Add features from each group to this plan
            foreach ($featureGroups as $groupKey => $groupFeatures) {
                $featureData = $groupFeatures[$planData['en_name']];

                // Set included to true by default unless explicitly set to false
                $included = isset($featureData['included']) ? $featureData['included'] : true;

                PlanFeature::create([
                    'ru_name'  => $featureData['ru_name'],
                    'en_name'  => $featureData['en_name'],
                    'plan_id'  => $plan->id,
                    'popular'  => $featureData['popular'],
                    'included' => $included,
                    'group'    => $groupKey,  // Add group identifier
                ]);
            }
        }
    }
}
