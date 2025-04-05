<?php

namespace Database\Seeders;

use App\Models\Vacancy;
use Illuminate\Database\Seeder;

class VacancySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vacancies = [
            [
                'title_ru' => 'Старший PHP разработчик',
                'title_en' => 'Senior PHP Developer',
                'description_ru' => 'Мы ищем опытного PHP разработчика для работы над нашим облачным продуктом. Вы будете отвечать за разработку новых функций, оптимизацию производительности и поддержку существующего кода.',
                'description_en' => 'We are looking for an experienced PHP developer to work on our cloud product. You will be responsible for developing new features, optimizing performance, and maintaining existing code.',
                'requirements_ru' => "- Опыт работы с PHP от 5 лет\n- Опыт работы с Laravel от 3 лет\n- Знание SQL и опыт работы с MySQL/PostgreSQL\n- Опыт работы с RESTful API\n- Понимание принципов SOLID, DRY, KISS\n- Опыт работы с Git",
                'requirements_en' => "- 5+ years of experience with PHP\n- 3+ years of experience with Laravel\n- Knowledge of SQL and experience with MySQL/PostgreSQL\n- Experience with RESTful APIs\n- Understanding of SOLID, DRY, KISS principles\n- Experience with Git",
                'location_ru' => 'Москва (удаленно)',
                'location_en' => 'Moscow (remote)',
                'is_active' => true,
                'published_at' => now(),
            ],
            [
                'title_ru' => 'Frontend разработчик (React)',
                'title_en' => 'Frontend Developer (React)',
                'description_ru' => 'Мы ищем талантливого Frontend разработчика для создания современных пользовательских интерфейсов. Вы будете работать в тесном сотрудничестве с дизайнерами и backend разработчиками для создания отзывчивых и интуитивно понятных веб-приложений.',
                'description_en' => 'We are looking for a talented Frontend Developer to create modern user interfaces. You will work closely with designers and backend developers to build responsive and intuitive web applications.',
                'requirements_ru' => "- Опыт работы с React от 2 лет\n- Знание современного JavaScript (ES6+)\n- Опыт работы с TypeScript\n- Понимание принципов отзывчивого дизайна\n- Опыт работы с системами контроля версий (Git)\n- Базовые знания HTML5 и CSS3",
                'requirements_en' => "- 2+ years of experience with React\n- Knowledge of modern JavaScript (ES6+)\n- Experience with TypeScript\n- Understanding of responsive design principles\n- Experience with version control systems (Git)\n- Basic knowledge of HTML5 and CSS3",
                'location_ru' => 'Санкт-Петербург (гибридный формат)',
                'location_en' => 'Saint Petersburg (hybrid)',
                'is_active' => true,
                'published_at' => now(),
            ],
            [
                'title_ru' => 'DevOps инженер',
                'title_en' => 'DevOps Engineer',
                'description_ru' => 'Мы ищем опытного DevOps инженера для автоматизации процессов разработки и развертывания. Вы будете отвечать за настройку и поддержку инфраструктуры, CI/CD пайплайнов и мониторинг производительности.',
                'description_en' => 'We are looking for an experienced DevOps Engineer to automate development and deployment processes. You will be responsible for setting up and maintaining infrastructure, CI/CD pipelines, and performance monitoring.',
                'requirements_ru' => "- Опыт работы с Docker и Kubernetes\n- Знание Linux/Unix систем\n- Опыт работы с CI/CD инструментами (Jenkins, GitLab CI)\n- Опыт работы с облачными провайдерами (AWS, GCP, Azure)\n- Знание инструментов мониторинга (Prometheus, Grafana)\n- Опыт автоматизации с использованием скриптов (Bash, Python)",
                'requirements_en' => "- Experience with Docker and Kubernetes\n- Knowledge of Linux/Unix systems\n- Experience with CI/CD tools (Jenkins, GitLab CI)\n- Experience with cloud providers (AWS, GCP, Azure)\n- Knowledge of monitoring tools (Prometheus, Grafana)\n- Automation experience using scripts (Bash, Python)",
                'location_ru' => 'Удаленно',
                'location_en' => 'Remote',
                'is_active' => true,
                'published_at' => now(),
            ],
        ];

        foreach ($vacancies as $vacancy) {
            Vacancy::create($vacancy);
        }
    }
}