<?php

// resources/lang/ru/payment.php
return [
    // Meta & Breadcrumbs
    'meta_title' => 'Оплата',
    'breadcrumb_payment' => 'Оплата',
    'breadcrumb_manage_plan' => 'Управление планом',

    // Heading
    'heading_title' => 'Завершите оплату',
    'heading_description' => 'Вы переходите на план :planName с :billingCycle оплатой',
    'billing_cycle_annual' => 'годовой',
    'billing_cycle_monthly' => 'ежемесячной',
    'billing_suffix_year' => '/год',
    'billing_suffix_month' => '/месяц',

    // Paid Plan: Summary Card
    'paid_summary_card_title' => 'Выбранный план: :planName',
    'paid_summary_card_desc_annual' => 'Годовая подписка',
    'paid_summary_card_desc_monthly' => 'Ежемесячная подписка',
    'paid_summary_card_features_title' => 'Включенные функции:',
    'paid_summary_card_feature_popular' => 'Популярный',
    'paid_summary_card_change_plan_link' => '← Изменить план',

    // Paid Plan: Payment Method Card
    'paid_method_card_title' => 'Способ оплаты',
    'paid_method_card_description' => 'Все транзакции безопасны и зашифрованы',
    'paid_method_option_card' => 'Кредитная/дебетовая карта',
    'paid_method_option_sbp' => 'СБП',
    'paid_method_card_holder_label' => 'Имя владельца карты',
    'paid_method_card_holder_placeholder' => 'Иван Иванов',
    'paid_method_card_number_label' => 'Номер карты',
    'paid_method_card_number_placeholder' => '1234 5678 9012 3456',
    'paid_method_card_expiry_label' => 'Срок действия',
    'paid_method_card_expiry_tooltip' => 'Введите срок действия вашей карты (ММ/ГГ)',
    'paid_method_card_expiry_placeholder' => 'ММ/ГГ',
    'paid_method_card_cvv_label' => 'Код безопасности (CVV)',
    'paid_method_card_cvv_tooltip' => '3-значный код на обратной стороне вашей карты',
    'paid_method_card_cvv_placeholder' => '123',
    'paid_method_sbp_alert_title' => 'Оплата через СБП',
    'paid_method_sbp_alert_description' => 'После отправки вы получите QR-код для сканирования в вашем банковском приложении.',
    'paid_method_secure_notice' => 'Ваша платежная информация защищена',
    'paid_method_button_processing' => 'Обработка...',
    'paid_method_button_pay' => 'Оплатить $:price:billingSuffix',

    // Paid Plan: Order Summary Card
    'paid_order_summary_title' => 'Сводка заказа',
    'paid_order_summary_plan_label' => 'План :planName',
    'paid_order_summary_discount_label' => 'Годовая скидка (:percentage%)',
    'paid_order_summary_total_label' => 'Итого',
    'paid_order_summary_tax_notice' => 'Налоги рассчитываются на основе вашего местоположения',

    // Free Plan: Summary Card
    'free_summary_card_title' => 'Бесплатный план',
    'free_summary_card_description' => 'Вы переходите на бесплатный план',
    'free_summary_card_features_title' => 'Включенные функции:',
    'free_summary_card_button' => 'Подтвердить переход на бесплатный план',
    'free_summary_card_button_processing' => 'Обработка...',
    'free_summary_card_change_plan_link' => '← Изменить план',

    // Free Plan: Downgrade Alert
    'free_downgrade_alert_title' => 'Внимание: Понижение плана',
    'free_downgrade_alert_description' => 'При переходе на бесплатный план вы потеряете доступ к премиум-функциям, и ваше хранилище будет ограничено 2 ГБ. Файлы, превышающие этот лимит, будут недоступны.',

    // Success State
    'success_title' => 'Оплата успешно выполнена!',
    'success_description' => 'Ваш план был успешно обновлен до :planName.',
    'success_button_dashboard' => 'Перейти в панель управления',
    'success_receipt_notice' => 'Квитанция была отправлена на вашу электронную почту.',

    // Error State
    'error_title' => 'Ошибка оплаты',
    'error_description' => 'Произошла ошибка при обработке вашего платежа.',
    'error_button_retry' => 'Попробовать снова',
    'error_button_support' => 'Связаться с поддержкой',
    'error_details_label' => 'Детали ошибки:',

    // SBP Payment State
    'sbp_title' => 'Оплата через СБП',
    'sbp_description' => 'Отсканируйте QR-код в вашем банковском приложении для завершения платежа.',
    'sbp_qr_alt' => 'QR-код для оплаты через СБП',
    'sbp_status_waiting' => 'Ожидание платежа...',
    'sbp_status_processing' => 'Обработка платежа...',
    'sbp_status_completed' => 'Платеж завершен!',
    'sbp_status_failed' => 'Платеж не удался',
    'sbp_button_cancel' => 'Отменить и вернуться',
    'sbp_button_check' => 'Проверить статус платежа',
    'sbp_expiry_notice' => 'QR-код действителен в течение :minutes минут',

    // Promo Code
    'promo_code_label' => 'Промокод',
    'promo_code_placeholder' => 'Введите промокод',
    'promo_code_button_apply' => 'Применить',
    'promo_code_button_remove' => 'Удалить',
    'promo_code_success' => 'Промокод :code применен!',
    'promo_code_error' => 'Недействительный промокод',
    'promo_code_discount_label' => 'Скидка по промокоду (:code)',

    // Misc
    'currency_symbol' => '$', // Может быть изменено в зависимости от локализации
    'secure_payment_notice' => 'Безопасная оплата через зашифрованное соединение',
    'terms_agreement_text' => 'Совершая платеж, вы соглашаетесь с нашими :terms и :privacy.',
    'terms_link_text' => 'Условиями использования',
    'privacy_link_text' => 'Политикой конфиденциальности',
    'payment_processing_message' => 'Пожалуйста, подождите, ваш платеж обрабатывается...',
];