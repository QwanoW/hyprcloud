<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimonials = [
            [
                'name_en' => 'Jane Doe',
                'name_ru' => 'Джейн Доу',
                'position_en' => 'Marketing Director',
                'position_ru' => 'Директор по маркетингу',
                'testimonial_en' => 'Hyprcloud has transformed how our team collaborates. The secure sharing features have made it so much easier to work with clients across the globe.',
                'testimonial_ru' => 'Hyprcloud изменил способ взаимодействия нашей команды. Функции безопасного обмена файлами значительно упростили работу с клиентами по всему миру.',
                'photo' => 'testimonials/jane-doe.webp',
                'show_on_homepage' => true,
            ],
            [
                'name_en' => 'Michael Smith',
                'name_ru' => 'Майкл Смит',
                'position_en' => 'Software Engineer',
                'position_ru' => 'Инженер-программист',
                'testimonial_en' => 'The speed and reliability of Hyprcloud is unmatched. I can upload large files in seconds, and the search functionality helps me find anything instantly.',
                'testimonial_ru' => 'Скорость и надежность Hyprcloud не имеют себе равных. Я могу загружать большие файлы за считанные секунды, а функция поиска помогает мне мгновенно находить нужное.',
                'photo' => 'testimonials/michael-smith.jpg',
                'show_on_homepage' => true,
            ],
            [
                'name_en' => 'Alex Thompson',
                'name_ru' => 'Алекс Томпсон',
                'position_en' => 'Small Business Owner',
                'position_ru' => 'Владелец малого бизнеса',
                'testimonial_en' => 'As a small business, data security is crucial for us. Hyprcloud gives us enterprise-level protection at a price we can afford. It\'s been a game-changer.',
                'testimonial_ru' => 'Для малого бизнеса безопасность данных имеет решающее значение. Hyprcloud обеспечивает нам защиту корпоративного уровня по доступной цене. Это полностью изменило нашу работу.',
                'photo' => 'testimonials/alex-thompson.jpg',
                'show_on_homepage' => true,
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }
    }
}