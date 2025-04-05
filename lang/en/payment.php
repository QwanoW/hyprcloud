<?php

// resources/lang/en/payment.php
return [
    // Meta & Breadcrumbs
    'meta_title' => 'Payment',
    'breadcrumb_payment' => 'Payment',
    'breadcrumb_manage_plan' => 'Manage plan',

    // Heading
    'heading_title' => 'Complete Your Payment',
    'heading_description' => 'You\'re upgrading to the :planName Plan with :billingCycle billing', // :planName, :billingCycle (annual/monthly)
    'billing_cycle_annual' => 'annual',
    'billing_cycle_monthly' => 'monthly',
    'billing_suffix_year' => '/year',
    'billing_suffix_month' => '/month',

    // Paid Plan: Summary Card
    'paid_summary_card_title' => 'Your Selected Plan: :planName',
    'paid_summary_card_desc_annual' => 'Annual subscription',
    'paid_summary_card_desc_monthly' => 'Monthly subscription',
    'paid_summary_card_features_title' => 'Included features:',
    'paid_summary_card_feature_popular' => 'Popular',
    'paid_summary_card_change_plan_link' => '← Change plan',

    // Paid Plan: Payment Method Card
    'paid_method_card_title' => 'Payment Method',
    'paid_method_card_description' => 'All transactions are secure and encrypted',
    'paid_method_option_card' => 'Credit/Debit Card',
    'paid_method_option_sbp' => 'SBP',
    'paid_method_card_holder_label' => 'Card Holder Name',
    'paid_method_card_holder_placeholder' => 'John Doe',
    'paid_method_card_number_label' => 'Card Number',
    'paid_method_card_number_placeholder' => '1234 5678 9012 3456',
    'paid_method_card_expiry_label' => 'Expiry Date',
    'paid_method_card_expiry_tooltip' => 'Enter the expiration date on your card (MM/YY)',
    'paid_method_card_expiry_placeholder' => 'MM/YY',
    'paid_method_card_cvv_label' => 'Security Code (CVV)',
    'paid_method_card_cvv_tooltip' => 'The 3-digit code on the back of your card',
    'paid_method_card_cvv_placeholder' => '123',
    'paid_method_sbp_alert_title' => 'SBP Payment',
    'paid_method_sbp_alert_description' => 'You\'ll receive a QR code to scan with your banking app after submitting.',
    'paid_method_secure_notice' => 'Your payment information is secure',
    'paid_method_button_processing' => 'Processing...',
    'paid_method_button_pay' => 'Pay $:price:billingSuffix',

    // Paid Plan: Order Summary Card
    'paid_order_summary_title' => 'Order Summary',
    'paid_order_summary_plan_label' => ':planName Plan',
    'paid_order_summary_discount_label' => 'Annual discount (:percentage%)',
    'paid_order_summary_total_label' => 'Total',
    'paid_order_summary_agreement_prefix' => 'By completing this purchase, you agree to our ',
    'paid_order_summary_terms_link_text' => 'Terms of Service',
    'paid_order_summary_agreement_suffix' => ' and authorize us to charge your payment method on a :billingFrequency basis until you cancel.',
    'billing_frequency_yearly' => 'yearly',
    'billing_frequency_monthly' => 'monthly',


    // Paid Plan: Billing Info Card
    'paid_billing_info_title' => 'Billing Information',
    'paid_billing_info_first_charge' => 'First billing: Immediately',
    'paid_billing_info_anytime' => 'You can upgrade or downgrade anytime',
    'paid_billing_info_guarantee' => '14-day money-back guarantee',
    'paid_billing_info_help_prefix' => 'Need help? ',
    'paid_billing_info_support_link_text' => 'Contact our support team',

    // Free Plan Card
    'free_card_title' => 'Activate Free Plan',
    'free_card_included_title' => 'Included in the Free Plan:',
    'free_card_alert_title' => 'No payment required',
    'free_card_alert_description' => 'You can upgrade to a paid plan at any time to access additional features.',
    'free_card_button_activate' => 'Activate Free Plan',
    'free_card_button_processing' => 'Processing...',
    'free_card_button_view_plans' => 'View Other Plans',

    // Free Plan: Order Summary Card
    'free_order_summary_title' => 'Order Summary',
    'free_order_summary_plan_label' => ':planName Plan',
    'free_order_summary_fee_label' => 'No subscription fee',
    'free_order_summary_total_label' => 'Total',

    // Footer Security Notice
    'footer_security_notice' => 'All payments are secure and encrypted using industry-standard SSL technology',

    // Alt texts (optional, often kept in English or descriptive)
    'alt_visa_card' => 'Visa',
    'alt_mastercard_card' => 'Mastercard',
    'alt_mir_card' => 'Mir',

     // ====================================
    // SBP Payment Page (QR Code)
    // ====================================

    'sbp_meta_title' => 'Payment via SBP',
    'sbp_breadcrumb_title' => 'Pay via SBP',

    // Header Section (SBP)
    'sbp_header_title' => 'Payment via SBP',
    'sbp_header_description_fallback' => 'Order payment',
    'sbp_header_order_label' => 'Order No.',
    'sbp_header_timer_label' => 'Time to pay',

    // Payment Details Card (SBP)
    'sbp_details_card_title' => 'Payment Details',
    'sbp_details_card_description' => 'Information about your payment',
    'sbp_details_amount_label' => 'Amount due:',
    'sbp_details_method_label' => 'Payment method:',
    'sbp_details_method_name' => 'Fast Payment System (SBP)',
    'sbp_details_status_label' => 'Status:',
    'sbp_details_status_waiting' => 'Waiting for payment',

    // Instructions Alert (SBP)
    'sbp_instructions_alert_title' => 'Payment Instructions',
    'sbp_instructions_step_1' => 'Scan the QR code with your phone camera',
    'sbp_instructions_step_2' => 'Open a bank app that supports SBP',
    'sbp_instructions_step_3' => 'Confirm the payment in your banking app',
    'sbp_instructions_step_4' => 'Wait for the transaction confirmation',

    // Button (SBP)
    'sbp_button_open_payment' => 'Open for Payment',

    // QR Code Card (SBP)
    'sbp_qr_card_title' => 'Scan the QR Code',
    'sbp_qr_card_description' => 'Use your phone camera or banking app',

    // Footer Status (SBP)
    'sbp_footer_status_text' => 'Page will be refreshed automatically after paying',

    // ====================================
    // Payment Success Page
    // ====================================
    'success_meta_title' => 'Payment Successful',
    'success_breadcrumb_manage_plan' => 'Manage plan',
    'success_breadcrumb_payment' => 'Payment', 
    'success_breadcrumb_success' => 'Success',

    // Card Content
    'success_card_title' => 'Payment Successful!',
    'success_card_description' => 'Your payment has been processed and your plan has been updated',
    'success_alert_title' => 'Welcome to the :planName Plan',
    'success_alert_description' => 'You now have access to all :planName features. Thank you for your subscription!', // :planName
    'success_current_plan_badge' => 'Your Current Plan: :planName', 

    // Footer Content
    'success_redirect_text' => 'Redirecting to dashboard in :countdown seconds',
    'success_redirect_progress_label' => ':countdown / 10',
    'success_button_dashboard_now' => 'Go to Dashboard Now',
];