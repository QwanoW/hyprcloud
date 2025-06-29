<?php

return [
    'title' => 'Руководство пользователя облачного хранилища',
    'description' => 'Изучите, как эффективно использовать все возможности вашего облачного хранилища.',
    'steps' => 'Шаги',

    // File Management Section
    'file_management' => [
        'title' => 'Управление файлами',
        'description' => 'Основные операции для работы с файлами и папками.',
        
        'upload' => [
            'title' => 'Загрузка файлов',
            'description' => 'Добавление новых файлов в облачное хранилище.',
            'step1' => 'Нажмите кнопку "Загрузить" в верхней панели инструментов',
            'step2' => 'Выберите файлы с вашего устройства или перетащите их в интерфейс',
            'step3' => 'Дождитесь завершения загрузки - вы увидите сообщение'
        ],
        
        'selection' => [
            'title' => 'Выделение файлов',
            'description' => 'Выбор файлов для массовых операций.',
            'step1' => 'Кликните на файл для его выделения (одиночное выделение)',
            'step2' => 'Удерживайте Ctrl/Cmd и кликайте для выделения нескольких файлов',
            'step3' => 'Перетащите мышью для выделения нескольких файлов в области'
        ],
        
        'folders' => [
            'title' => 'Создание папок',
            'description' => 'Организация файлов с помощью папок.',
            'step1' => 'Нажмите выпадающее меню "Создать" в панели инструментов',
            'step2' => 'Выберите "Создать папку" из меню',
            'step3' => 'Введите имя для вашей папки и подтвердите'
        ]
    ],

    // Collections Section
    'collections' => [
        'title' => 'Коллекции',
        'description' => 'Организация файлов в тематические коллекции для лучшего управления.',
        
        'create' => [
            'title' => 'Создание коллекции',
            'description' => 'Группировка связанных файлов вместе.',
            'step1' => 'Нажмите выпадающее меню "Создать" в панели инструментов',
            'step2' => 'Выберите "Создать коллекцию" из меню',
            'step3' => 'Выберите имя и иконку для вашей коллекции'
        ],
        
        'organize' => [
            'title' => 'Организация коллекций',
            'description' => 'Управление файлами внутри коллекций.',
            'step1' => 'Перейдите к коллекции из боковой панели',
            'step2' => 'Добавляйте файлы, перемещая их или загружая напрямую в коллекцию'
        ]
    ],

    // File Actions Section
    'file_actions' => [
        'title' => 'Действия с файлами',
        'description' => 'Доступные операции, которые можно выполнять с вашими файлами.',
        
        'sharing' => [
            'title' => 'Общий доступ к файлам',
            'description' => 'Создание ссылок для совместного доступа к файлам.',
            'step1' => 'Выберите файл и нажмите кнопку "Поделиться"',
            'step2' => 'Настройте параметры общего доступа (пароль, срок действия, разрешения на скачивание)',
            'step3' => 'Скопируйте созданную ссылку для передачи другим'
        ],
        
        'download' => [
            'title' => 'Скачивание файлов',
            'description' => 'Сохранение файлов на ваше устройство.',
            'step1' => 'Выберите один или несколько файлов',
            'step2' => 'Кликните правой кнопкой мыши и выберите "Скачать Zip" или дважды кликните на файл для открытия диалогового окна со слайдером, где сверху будет кнопка скачать'
        ],
        
        'move' => [
            'title' => 'Перемещение файлов',
            'description' => 'Перемещение файлов в другие папки или коллекции.',
            'step1' => 'Выберите файлы, которые хотите переместить',
            'step2' => 'Кликните правой кнопкой мыши и выберите "Переместить" из контекстного меню',
            'step3' => 'Выберите папку или коллекцию назначения'
        ],
        
        'rename' => [
            'title' => 'Переименование файлов',
            'description' => 'Изменение имен файлов и папок.',
            'step1' => 'Выберите один файл или папку',
            'step2' => 'Кликните правой кнопкой мыши и выберите "Переименовать"'
        ],
        
        'delete' => [
            'title' => 'Удаление файлов',
            'description' => 'Удаление файлов из вашего хранилища.',
            'step1' => 'Выберите файлы, которые хотите удалить',
            'step2' => 'Нажмите кнопку "Удалить"'
        ]
    ],

    // Navigation Section
    'navigation' => [
        'title' => 'Навигация',
        'description' => 'Понимание различных разделов вашего облачного хранилища.',
        
        'all_files' => [
            'title' => 'Все файлы',
            'description' => 'Просмотр всех ваших файлов и папок в одном месте.'
        ],
        
        'gallery' => [
            'title' => 'Галерея',
            'description' => 'Просмотр ваших изображений и медиафайлов в визуальной сетке.'
        ],
        
        'shared' => [
            'title' => 'Общие файлы',
            'description' => 'Управление файлами, которыми вы поделились с другими, и просмотр настроек общего доступа.'
        ],
        
        'trash' => [
            'title' => 'Корзина',
            'description' => 'Восстановление удаленных файлов или их окончательное удаление.'
        ],
        
        'search' => [
            'title' => 'Глобальный поиск',
            'description' => 'Быстрый поиск файлов по имени или содержимому во всем хранилище.'
        ],
        
        'analytics' => [
            'title' => 'Аналитика',
            'description' => 'Просмотр статистики использования хранилища и активности файлов.'
        ]
    ],

    // Advanced Features Section
    'advanced' => [
        'title' => 'Расширенные возможности',
        'description' => 'Функции для опытных пользователей для повышения продуктивности.',
        
        'bulk_download' => [
            'title' => 'Массовое скачивание',
            'description' => 'Скачивание нескольких файлов в виде ZIP-архива.',
            'step1' => 'Выберите несколько файлов или папок',
            'step2' => 'Кликните правой кнопкой мыши и выберите "Скачать как ZIP"'
        ],
        
        'restore' => [
            'title' => 'Восстановление файлов',
            'description' => 'Восстановление файлов из корзины.',
            'step1' => 'Перейдите в раздел "Корзина"',
            'step2' => 'Выберите файлы и нажмите "Восстановить" для возврата в исходное местоположение'
        ],
        
        'preview' => [
            'title' => 'Предварительный просмотр файлов',
            'description' => 'Просмотр содержимого файлов без скачивания.',
            'step1' => 'Дважды кликните на поддерживаемый тип файла (изображения, документы, видео)',
            'step2' => 'Используйте модальное окно предварительного просмотра для просмотра содержимого и навигации между файлами'
        ]
    ]
];