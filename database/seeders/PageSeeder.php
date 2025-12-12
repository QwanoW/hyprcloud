<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Privacy Policy
        Page::create([
            'slug' => 'privacy-policy',
            'title_en' => 'Privacy Policy',
            'title_ru' => 'Политика конфиденциальности',
            'content_en' => <<<MARKDOWN
# Privacy Policy

Last Updated: April 3, 2025

## 1. Introduction

Welcome to Hyprcloud ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cloud storage service.

## 2. Information We Collect

### 2.1 Personal Information

We may collect the following types of personal information:

- Account Information: Name, email address, phone number, and billing information when you register for an account.
- Profile Information: Information you provide in your user profile.
- Subscription Details: Information about your subscription plan and payment history.
- User Content: Files and data you upload to our service.

### 2.2 Usage Information

We automatically collect certain information about how you use our service, including:

- Log Data: IP address, browser type, pages visited, time and date of visits, and other statistics.
- Device Information: Device type, operating system, and unique device identifiers.
- File Metadata: File names, sizes, types, and modification dates.

## 3. How We Use Your Information

We use your information for the following purposes:

- To provide, maintain, and improve our services.
- To process transactions and manage your account.
- To respond to your inquiries and provide customer support.
- To send service-related notifications and updates.
- To monitor and analyze usage patterns and trends.
- To detect, prevent, and address technical issues and security threats.
- To comply with legal obligations.

## 4. Data Storage and Security

We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, accidental loss, or destruction. Your files are encrypted both during transmission and while stored on our servers. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.

## 5. Sharing Your Information

We may share your information with:

- Service Providers: Third-party vendors and service providers who help us operate our business and provide services.
- Business Partners: Trusted partners with whom we collaborate to offer integrated services.
- Legal Requirements: When required by law, legal process, or government authorities.
- Business Transfers: In connection with a merger, acquisition, reorganization, or sale of assets.

## 6. Your Choices and Rights

Depending on your location, you may have certain rights regarding your personal information, including:

- Access: Request access to personal information we hold about you.
- Correction: Request correction of inaccurate or incomplete information.
- Deletion: Request deletion of your personal information and content.
- Portability: Request transfer of your information to another service.
- Opt-out: Opt-out of marketing communications and certain data processing.

## 7. Cookies and Similar Technologies

We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie settings through your browser preferences.

## 8. International Data Transfers

Your information may be transferred to and processed in countries other than your country of residence. We take appropriate safeguards to ensure the protection of your information when transferred internationally.

## 9. Children's Privacy

Our services are not intended for individuals under the age of 16. We do not knowingly collect personal information from children without verifiable parental consent.

## 10. Changes to This Privacy Policy

We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of any material changes through our website or by email.

## 11. Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us at privacy@hyprcloud.com.
MARKDOWN,
            'content_ru' => <<<MARKDOWN
# Политика конфиденциальности

Последнее обновление: 3 апреля 2025 г.

## 1. Введение

Добро пожаловать в Hyprcloud ("мы", "наш" или "нас"). Мы стремимся защищать вашу конфиденциальность и обеспечивать безопасность вашей личной информации. Эта Политика конфиденциальности объясняет, как мы собираем, используем, раскрываем и защищаем вашу информацию при использовании нашего облачного хранилища.

## 2. Информация, которую мы собираем

### 2.1 Личная информация

Мы можем собирать следующие типы личной информации:

- Информация об учетной записи: имя, адрес электронной почты, номер телефона и платежная информация при регистрации учетной записи.
- Информация профиля: информация, которую вы предоставляете в своем профиле пользователя.
- Детали подписки: информация о вашем тарифном плане и истории платежей.
- Пользовательский контент: файлы и данные, которые вы загружаете в наш сервис.

### 2.2 Информация об использовании

Мы автоматически собираем определенную информацию о том, как вы используете наш сервис, включая:

- Данные журнала: IP-адрес, тип браузера, посещенные страницы, время и дата посещений и другая статистика.
- Информация об устройстве: тип устройства, операционная система и уникальные идентификаторы устройства.
- Метаданные файлов: имена файлов, размеры, типы и даты изменения.

## 3. Как мы используем вашу информацию

Мы используем вашу информацию для следующих целей:

- Предоставление, поддержка и улучшение наших услуг.
- Обработка транзакций и управление вашей учетной записью.
- Ответы на ваши запросы и предоставление поддержки клиентов.
- Отправка уведомлений и обновлений, связанных с сервисом.
- Мониторинг и анализ моделей использования и тенденций.
- Обнаружение, предотвращение и устранение технических проблем и угроз безопасности.
- Соблюдение юридических обязательств.

## 4. Хранение данных и безопасность

Мы внедряем соответствующие технические и организационные меры для защиты вашей личной информации от несанкционированного доступа, случайной потери или уничтожения. Ваши файлы шифруются как во время передачи, так и при хранении на наших серверах. Однако ни один метод электронной передачи или хранения не является 100% безопасным, и мы не можем гарантировать абсолютную безопасность.

## 5. Обмен вашей информацией

Мы можем делиться вашей информацией с:

- Поставщиками услуг: сторонними поставщиками и поставщиками услуг, которые помогают нам управлять нашим бизнесом и предоставлять услуги.
- Бизнес-партнерами: доверенными партнерами, с которыми мы сотрудничаем для предоставления интегрированных услуг.
- Юридические требования: когда это требуется по закону, юридическому процессу или государственным органам.
- Передача бизнеса: в связи с слиянием, приобретением, реорганизацией или продажей активов.

## 6. Ваш выбор и права

В зависимости от вашего местоположения, у вас могут быть определенные права в отношении вашей личной информации, включая:

- Доступ: запрос доступа к личной информации, которую мы храним о вас.
- Исправление: запрос на исправление неточной или неполной информации.
- Удаление: запрос на удаление вашей личной информации и контента.
- Переносимость: запрос на передачу вашей информации в другой сервис.
- Отказ: отказ от маркетинговых сообщений и определенной обработки данных.

## 7. Файлы cookie и аналогичные технологии

Мы используем файлы cookie и аналогичные технологии для улучшения вашего опыта, анализа моделей использования и предоставления персонализированного контента. Вы можете управлять настройками файлов cookie через настройки вашего браузера.

## 8. Международная передача данных

Ваша информация может быть передана и обработана в странах, отличных от страны вашего проживания. Мы принимаем соответствующие меры для обеспечения защиты вашей информации при международной передаче.

## 9. Конфиденциальность детей

Наши услуги не предназначены для лиц младше 16 лет. Мы сознательно не собираем личную информацию от детей без проверяемого согласия родителей.

## 10. Изменения в этой Политике конфиденциальности

Мы можем периодически обновлять эту Политику конфиденциальности, чтобы отражать изменения в наших практиках или юридических требованиях. Мы уведомим вас о любых существенных изменениях через наш веб-сайт или по электронной почте.

## 11. Свяжитесь с нами

Если у вас есть какие-либо вопросы или опасения по поводу этой Политики конфиденциальности, пожалуйста, свяжитесь с нами по адресу privacy@hyprcloud.com.
MARKDOWN,
            'last_updated' => Carbon::now(),
        ]);

        Page::create([
            'slug' => 'terms-of-service',
            'title_en' => 'Terms of Service',
            'title_ru' => 'Условия использования',
            'content_en' => <<<MARKDOWN
# Terms of Service

Last Updated: April 3, 2025

## 1. Acceptance of Terms

By accessing or using Hyprcloud's services, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.

## 2. Service Description

Hyprcloud provides cloud storage services that allow users to upload, store, share, download, and manage digital files. Our services are available through our website and applications, subject to these Terms.

## 3. Account Registration and Security

To use our services, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:

- Provide accurate and complete information when creating your account.
- Update your information to keep it current.
- Notify us immediately of any unauthorized access or use of your account.
- Not share your account credentials with third parties.

## 4. Subscription Plans and Payments

Hyprcloud offers various subscription plans with different storage capacities and features. By subscribing to a paid plan, you agree to:

- Pay all fees associated with your selected plan.
- Provide accurate billing information.
- Authorize us to charge your payment method for subscription fees.

Subscription fees are charged at the beginning of each billing cycle. We may change our fees upon notice, and continued use of our services after such notice constitutes acceptance of the new fees.

## 5. User Content

### 5.1 Ownership

You retain all ownership rights to the content you upload to our services. By uploading content, you grant us a limited license to store, display, and process your content solely for the purpose of providing our services to you.

### 5.2 Prohibited Content

You agree not to upload, store, or share content that:

- Violates any applicable laws or regulations.
- Infringes upon intellectual property rights of others.
- Contains malware, viruses, or harmful code.
- Is defamatory, obscene, or offensive.
- Promotes illegal activities or harms minors.

## 6. User Conduct

When using our services, you agree not to:

- Attempt to gain unauthorized access to our systems or other users' accounts.
- Use our services for any illegal or unauthorized purpose.
- Interfere with or disrupt the integrity or performance of our services.
- Circumvent our security measures or service limitations.
- Engage in activities that impose an unreasonable load on our infrastructure.

## 7. Termination

We may suspend or terminate your access to our services if:

- You breach these Terms.
- You fail to pay subscription fees.
- We are required to do so by law.
- Continued provision of services to you is commercially infeasible.

Upon termination, your right to use our services ceases immediately, and we may delete your content after a grace period.

## 8. Service Availability and Modifications

We strive to ensure that our services are available at all times, but do not guarantee uninterrupted access. We may modify, suspend, or discontinue any aspect of our services at any time, with or without notice.

## 9. Disclaimers and Limitations of Liability

OUR SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR OUR SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

## 10. Indemnification

You agree to indemnify and hold harmless Hyprcloud, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from your use of our services or violation of these Terms.

## 11. Governing Law and Dispute Resolution

These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction]. Any dispute arising from these Terms shall be resolved through arbitration in accordance with the rules of [Arbitration Association].

## 12. Changes to Terms

We may update these Terms from time to time. We will notify you of material changes through our website or by email. Your continued use of our services after such changes constitutes acceptance of the new Terms.

## 13. Contact Information

If you have any questions about these Terms, please contact us at legal@hyprcloud.com.
MARKDOWN,
            'content_ru' => <<<MARKDOWN
# Условия использования

Последнее обновление: 3 апреля 2025 г.

## 1. Принятие условий

Используя сервисы Hyprcloud, вы соглашаетесь соблюдать настоящие Условия использования ("Условия"). Если вы не согласны с этими Условиями, пожалуйста, не используйте наши сервисы.

## 2. Описание сервиса

Hyprcloud предоставляет услуги облачного хранилища, которые позволяют пользователям загружать, хранить, делиться, скачивать и управлять цифровыми файлами. Наши услуги доступны через наш веб-сайт и приложения в соответствии с настоящими Условиями.

## 3. Регистрация учетной записи и безопасность

Для использования наших услуг вы должны создать учетную запись. Вы несете ответственность за сохранение конфиденциальности учетных данных и за все действия, которые происходят в вашей учетной записи. Вы соглашаетесь:

- Предоставлять точную и полную информацию при создании учетной записи.
- Обновлять информацию, чтобы она оставалась актуальной.
- Немедленно уведомлять нас о любом несанкционированном доступе или использовании вашей учетной записи.
- Не делиться учетными данными с третьими лицами.

## 4. Тарифные планы и платежи

Hyprcloud предлагает различные тарифные планы с разной емкостью хранилища и функциями. Подписываясь на платный план, вы соглашаетесь:

- Оплачивать все сборы, связанные с выбранным планом.
- Предоставлять точную платежную информацию.
- Разрешать нам списывать средства с вашего способа оплаты за подписку.

Плата за подписку взимается в начале каждого расчетного периода. Мы можем изменить наши тарифы после уведомления, и продолжение использования наших услуг после такого уведомления означает принятие новых тарифов.

## 5. Пользовательский контент

### 5.1 Право собственности

Вы сохраняете все права собственности на контент, который вы загружаете в наши сервисы. Загружая контент, вы предоставляете нам ограниченную лицензию на хранение, отображение и обработку вашего контента исключительно с целью предоставления вам наших услуг.

### 5.2 Запрещенный контент

Вы соглашаетесь не загружать, не хранить и не делиться контентом, который:

- Нарушает любые применимые законы или правила.
- Нарушает права интеллектуальной собственности других лиц.
- Содержит вредоносное ПО, вирусы или вредоносный код.
- Является клеветническим, непристойным или оскорбительным.
- Пропагандирует незаконную деятельность или наносит вред несовершеннолетним.

## 6. Поведение пользователя

При использовании наших услуг вы соглашаетесь не:

- Пытаться получить несанкционированный доступ к нашим системам или учетным записям других пользователей.
- Использовать наши услуги для любых незаконных или несанкционированных целей.
- Вмешиваться в целостность или работу наших услуг или нарушать их.
- Обходить наши меры безопасности или ограничения сервиса.
- Заниматься деятельностью, которая создает необоснованную нагрузку на нашу инфраструктуру.

## 7. Прекращение

Мы можем приостановить или прекратить ваш доступ к нашим услугам, если:

- Вы нарушаете настоящие Условия.
- Вы не оплачиваете подписку.
- Мы обязаны сделать это по закону.
- Дальнейшее предоставление услуг вам коммерчески нецелесообразно.

После прекращения ваше право на использование наших услуг немедленно прекращается, и мы можем удалить ваш контент после льготного периода.

## 8. Доступность сервиса и изменения

Мы стремимся обеспечить постоянную доступность наших услуг, но не гарантируем непрерывный доступ. Мы можем изменять, приостанавливать или прекращать любой аспект наших услуг в любое время, с уведомлением или без него.

## 9. Отказ от ответственности и ограничения ответственности

НАШИ УСЛУГИ ПРЕДОСТАВЛЯЮТСЯ "КАК ЕСТЬ" БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ, ЯВНЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ. В МАКСИМАЛЬНОЙ СТЕПЕНИ, РАЗРЕШЕННОЙ ЗАКОНОМ, МЫ ОТКАЗЫВАЕМСЯ ОТ ВСЕХ ГАРАНТИЙ, ВКЛЮЧАЯ ПОДРАЗУМЕВАЕМЫЕ ГАРАНТИИ КОММЕРЧЕСКОЙ ПРИГОДНОСТИ, ПРИГОДНОСТИ ДЛЯ ОПРЕДЕЛЕННОЙ ЦЕЛИ И НЕНАРУШЕНИЯ ПРАВ.

НИ ПРИ КАКИХ ОБСТОЯТЕЛЬСТВАХ МЫ НЕ НЕСЕМ ОТВЕТСТВЕННОСТИ ЗА ЛЮБЫЕ КОСВЕННЫЕ, СЛУЧАЙНЫЕ, ОСОБЫЕ, ПОСЛЕДУЮЩИЕ ИЛИ ШТРАФНЫЕ УБЫТКИ, ВКЛЮЧАЯ ПОТЕРЮ ПРИБЫЛИ, ДАННЫХ ИЛИ ИСПОЛЬЗОВАНИЯ, ВОЗНИКАЮЩИЕ В СВЯЗИ С НАСТОЯЩИМИ УСЛОВИЯМИ ИЛИ НАШИМИ УСЛУГАМИ, ДАЖЕ ЕСЛИ МЫ БЫЛИ ПРЕДУПРЕЖДЕНЫ О ВОЗМОЖНОСТИ ТАКИХ УБЫТКОВ.

## 10. Возмещение ущерба

Вы соглашаетесь возместить ущерб и оградить Hyprcloud, его должностных лиц, директоров, сотрудников и агентов от любых претензий, убытков, обязательств и расходов (включая гонорары адвокатов), возникающих в результате использования вами наших услуг или нарушения настоящих Условий.

## 11. Применимое право и разрешение споров

Настоящие Условия регулируются и толкуются в соответствии с законодательством [Юрисдикция]. Любой спор, возникающий из настоящих Условий, должен разрешаться путем арбитража в соответствии с правилами [Арбитражной ассоциации].

## 12. Изменения условий

Мы можем время от времени обновлять настоящие Условия. Мы уведомим вас о существенных изменениях через наш веб-сайт или по электронной почте. Продолжение использования наших услуг после таких изменений означает принятие новых Условий.

## 13. Контактная информация

Если у вас есть какие-либо вопросы об этих Условиях, пожалуйста, свяжитесь с нами по адресу legal@hyprcloud.com.
MARKDOWN,
            'last_updated' => Carbon::now(),
        ]);

        Page::create([
            'slug' => 'about-us',
            'title_en' => 'About Us',
            'title_ru' => 'О нас',
            'content_en' => <<<MARKDOWN
# About Hyprcloud

## Our Mission

At Hyprcloud, we're on a mission to provide secure, reliable, and user-friendly cloud storage solutions that empower individuals and businesses to store, access, and share their digital assets with confidence.

## Who We Are

Founded in 2023, Hyprcloud emerged from a simple idea: cloud storage should be both powerful and straightforward. Our team of experienced engineers, designers, and security experts came together with a shared vision of creating a storage platform that combines enterprise-grade security with consumer-grade simplicity.

We are a diverse and passionate team dedicated to innovation and excellence in cloud technology. With decades of combined experience in data management, cybersecurity, and user experience design, we've built a platform that addresses the real needs of modern digital users.

## What Sets Us Apart

### Security First

We implement end-to-end encryption and advanced security protocols to ensure your data remains private and protected. Your files are encrypted both in transit and at rest, with only you holding the keys to your data.

### Seamless Experience

We've designed our platform with user experience at its core. From intuitive file sharing to one-click downloads and ZIP archive creation, every feature is optimized for simplicity and efficiency.

### Flexible Solutions

Whether you're an individual looking to back up personal photos, a freelancer sharing large files with clients, or an enterprise managing terabytes of data, our range of subscription plans offers the perfect solution for your needs.

### Reliable Infrastructure

Built on a distributed cloud architecture, Hyprcloud ensures high availability and rapid access to your files from anywhere in the world. Our redundant storage systems guarantee data durability even in the face of hardware failures.

## Our Values

- **Privacy:** We believe your data belongs to you, and we design all our systems with privacy as a fundamental principle.
- **Transparency:** We communicate openly about our practices, policies, and any changes that might affect our users.
- **Innovation:** We continuously refine our technology to stay ahead of evolving security threats and user needs.
- **Reliability:** We understand that you depend on our service to access important files, and we take that responsibility seriously.
- **Sustainability:** We optimize our operations to minimize environmental impact and contribute to a more sustainable digital ecosystem.

## Our Technology

Hyprcloud leverages cutting-edge technologies to deliver a superior cloud storage experience:

- Advanced encryption algorithms to protect your data
- Distributed storage architecture for maximum reliability
- Intelligent caching systems for rapid file access
- Adaptive bandwidth management for smooth uploads and downloads
- Comprehensive version control to protect against accidental changes

## Join Us

Whether you're looking for a secure place to store your memories, a reliable way to share large files, or a comprehensive solution for your organization's data management needs, Hyprcloud is here to help. Join thousands of satisfied users who trust us with their valuable digital assets.

Ready to experience the future of cloud storage? [Sign up today](/signup) and discover why Hyprcloud is the storage solution you've been waiting for.

## Contact Us

Have questions or feedback? We'd love to hear from you.

Email: info@hyprcloud.com
Support: support@hyprcloud.com
Phone: +1 (555) 123-4567
MARKDOWN,
            'content_ru' => <<<MARKDOWN
# О нас

## Наша миссия

В Hyprcloud наша миссия - предоставлять безопасные, надежные и удобные решения для облачного хранения, которые позволяют частным лицам и компаниям уверенно хранить, получать доступ и обмениваться своими цифровыми активами.

## Кто мы

Основанная в 2023 году, компания Hyprcloud возникла из простой идеи: облачное хранилище должно быть одновременно мощным и простым. Наша команда опытных инженеров, дизайнеров и экспертов по безопасности объединилась с общим видением создания платформы хранения, которая сочетает в себе безопасность корпоративного уровня с простотой потребительского уровня.

Мы - разнообразная и увлеченная команда, преданная инновациям и совершенству в облачных технологиях. Обладая десятилетиями совместного опыта в управлении данными, кибербезопасности и проектировании пользовательского опыта, мы создали платформу, отвечающую реальным потребностям современных цифровых пользователей.

## Что нас отличает

### Безопасность прежде всего

Мы внедряем сквозное шифрование и передовые протоколы безопасности, чтобы гарантировать конфиденциальность и защиту ваших данных. Ваши файлы шифруются как при передаче, так и в состоянии покоя, причем ключи к вашим данным находятся только у вас.

### Бесшовный опыт

Мы разработали нашу платформу, поставив во главу угла удобство пользователя. От интуитивно понятного обмена файлами до загрузки одним щелчком мыши и создания ZIP-архивов - каждая функция оптимизирована для простоты и эффективности.

### Гибкие решения

Независимо от того, являетесь ли вы частным лицом, желающим сделать резервную копию личных фотографий, фрилансером, обменивающимся большими файлами с клиентами, или предприятием, управляющим терабайтами данных, наш ассортимент тарифных планов предлагает идеальное решение для ваших нужд.

### Надежная инфраструктура

Построенный на распределенной облачной архитектуре, Hyprcloud обеспечивает высокую доступность и быстрый доступ к вашим файлам из любой точки мира. Наши резервные системы хранения гарантируют сохранность данных даже в случае аппаратных сбоев.

## Наши ценности

- **Конфиденциальность:** Мы считаем, что ваши данные принадлежат вам, и мы проектируем все наши системы, исходя из конфиденциальности как основополагающего принципа.
- **Прозрачность:** Мы открыто сообщаем о наших практиках, политиках и любых изменениях, которые могут повлиять на наших пользователей.
- **Инновации:** Мы постоянно совершенствуем наши технологии, чтобы опережать развивающиеся угрозы безопасности и потребности пользователей.
- **Надежность:** Мы понимаем, что вы зависите от нашего сервиса для доступа к важным файлам, и мы серьезно относимся к этой ответственности.
- **Устойчивость:** Мы оптимизируем наши операции, чтобы минимизировать воздействие на окружающую среду и способствовать более устойчивой цифровой экосистеме.

## Наши технологии

Hyprcloud использует передовые технологии для обеспечения превосходного опыта облачного хранения:

- Передовые алгоритмы шифрования для защиты ваших данных
- Распределенная архитектура хранения для максимальной надежности
- Интеллектуальные системы кэширования для быстрого доступа к файлам
- Адаптивное управление пропускной способностью для плавной загрузки и скачивания
- Комплексный контроль версий для защиты от случайных изменений

## Присоединяйтесь к нам

Ищете ли вы безопасное место для хранения ваших воспоминаний, надежный способ обмена большими файлами или комплексное решение для управления данными вашей организации, Hyprcloud здесь, чтобы помочь. Присоединяйтесь к тысячам довольных пользователей, которые доверяют нам свои ценные цифровые активы.

Готовы испытать будущее облачного хранения? [Зарегистрируйтесь сегодня](/signup) и узнайте, почему Hyprcloud - это решение для хранения, которого вы так долго ждали.

## Свяжитесь с нами

Есть вопросы или отзывы? Мы будем рады услышать от вас.

Эл. почта: info@hyprcloud.com
Поддержка: support@hyprcloud.com
Телефон: +1 (555) 123-4567
MARKDOWN,
            'last_updated' => Carbon::now(),
        ]);
    }
}