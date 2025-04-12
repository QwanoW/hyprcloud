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
    'paid_method_button_pay' => 'Оплатить :price:billingSuffix',

    // Paid Plan: Order Summary Card
    'paid_order_summary_title' => 'Сводка заказа',
    'paid_order_summary_plan_label' => 'План :planName',
    'paid_order_summary_discount_label' => 'Годовая скидка (:percentage%)',
    'paid_order_summary_total_label' => 'Итого',
    'paid_order_summary_agreement_prefix' => 'Совершая эту покупку, вы соглашаетесь с нашими ',
    'paid_order_summary_terms_link_text' => 'Условиями использования',
    'paid_order_summary_agreement_suffix' => ' и разрешаете нам списывать средства с вашего способа оплаты на :billingFrequency основе до момента отмены.',
    'billing_frequency_yearly' => 'ежегодной',
    'billing_frequency_monthly' => 'ежемесячной',

    // Paid Plan: Billing Info Card
    'paid_billing_info_title' => 'Платежная информация',
    'paid_billing_info_first_charge' => 'Первый платеж: моментальный',
    'paid_billing_info_anytime' => 'Вы можете повысить или понизить тариф в любое время',
    'paid_billing_info_guarantee' => '14-дневная гарантия возврата денег',
    'paid_billing_info_help_prefix' => 'Нужна помощь? ',
    'paid_billing_info_support_link_text' => 'Свяжитесь с нашей службой поддержки',

    // Free Plan: Summary Card
    'free_summary_card_title' => 'Бесплатный план',
    'free_summary_card_description' => 'Вы переходите на бесплатный план',
    'free_summary_card_features_title' => 'Включенные функции:',
    'free_summary_card_button' => 'Подтвердить переход на бесплатный план',
    'free_summary_card_button_processing' => 'Обработка...',
    'free_summary_card_change_plan_link' => '← Изменить план',

    // Footer Security Notice
    'footer_security_notice' => 'Все платежи безопасны и зашифрованы с использованием технологии SSL',

    // Free Plan: Downgrade Alert
    'free_downgrade_alert_title' => 'Внимание: Понижение плана',
    'free_downgrade_alert_description' => 'При переходе на бесплатный план вы потеряете доступ к премиум-функциям, и ваше хранилище будет ограничено 2 ГБ. Файлы, превышающие этот лимит, будут недоступны.',

    // Success State
    'success_title' => 'Оплата успешно выполнена!',
    'success_description' => 'Ваш план был успешно обновлен до :planName.',
    'success_button_dashboard' => 'Перейти в панель управления',
    'success_receipt_notice' => 'Квитанция была отправлена на вашу электронную почту.',
    
    // Success Page
    'success_meta_title' => 'Оплата успешно выполнена',
    'success_breadcrumb_manage_plan' => 'Управление планом',
    'success_breadcrumb_success' => 'Успешная оплата',
    'success_card_title' => 'Оплата прошла успешно!',
    'success_card_description' => 'Ваш платеж был успешно обработан, и ваш план был обновлен.',
    'success_alert_title' => 'Поздравляем с переходом на план :planName!',
    'success_alert_description' => 'Вы успешно активировали план :planName. Теперь вы можете пользоваться всеми его преимуществами.',
    'success_current_plan_badge' => 'Ваш текущий план: :planName',
    'success_redirect_text' => 'Перенаправление через :countdown секунд',
    'success_redirect_progress_label' => 'Осталось :countdown сек',
    'success_button_dashboard_now' => 'Перейти в панель управления сейчас',

    // Error State
    'error_title' => 'Ошибка оплаты',
    'error_description' => 'Произошла ошибка при обработке вашего платежа.',
    'error_button_retry' => 'Попробовать снова',
    'error_button_support' => 'Связаться с поддержкой',
    'error_details_label' => 'Детали ошибки:',

         // ====================================
    // SBP Payment Page (QR Code)
    // ====================================

    'sbp_meta_title' => 'Оплата через СБП',
    'sbp_breadcrumb_title' => 'Оплата через СБП',

    // Header Section (SBP)
    'sbp_header_title' => 'Оплата через СБП',
    'sbp_header_description_fallback' => 'Оплата заказа',
    'sbp_header_order_label' => 'Заказ №',
    'sbp_header_timer_label' => 'Время на оплату',

    // Payment Details Card (SBP)
    'sbp_details_card_title' => 'Детали платежа',
    'sbp_details_card_description' => 'Информация о вашем платеже',
    'sbp_details_amount_label' => 'Сумма к оплате:',
    'sbp_details_method_label' => 'Способ оплаты:',
    'sbp_details_method_name' => 'Система быстрых платежей (СБП)',
    'sbp_details_status_label' => 'Статус:',
    'sbp_details_status_waiting' => 'Ожидание оплаты',

    // Instructions Alert (SBP)
    'sbp_instructions_alert_title' => 'Инструкции по оплате',
    'sbp_instructions_step_1' => 'Отсканируйте QR-код камерой телефона',
    'sbp_instructions_step_2' => 'Откройте банковское приложение с поддержкой СБП',
    'sbp_instructions_step_3' => 'Подтвердите платёж в банковском приложении',
    'sbp_instructions_step_4' => 'Дождитесь подтверждения транзакции',

    // Button (SBP)
    'sbp_button_open_payment' => 'Открыть для оплаты',

    // QR Code Card (SBP)
    'sbp_qr_card_title' => 'Отсканируйте QR-код',
    'sbp_qr_card_description' => 'Используйте камеру телефона или банковское приложение',

    // Footer Status (SBP)
    'sbp_footer_status_text' => 'Страница обновится автоматически после оплаты',

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