<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description"
        content="Secure cloud storage solution for your files and data. Store, sync and share with confidence. | Безопасное облачное хранилище для ваших файлов и данных. Храните, синхронизируйте и делитесь с уверенностью.">
    <meta name="keywords"
        content="cloud storage, file sharing, data backup, secure storage, cloud sync, облачное хранилище, обмен файлами, резервное копирование, безопасное хранение, облачная синхронизация">
    <meta name="author" content="{{ config('app.name', 'Laravel') }}">
    <meta name="robots" content="index, follow">

    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:title" content="{{ config('app.name', 'Laravel') }} - Cloud Storage | Облачное хранилище">
    <meta property="og:description"
        content="Secure cloud storage solution for your files and data. Store, sync and share with confidence. | Безопасное облачное хранилище для ваших файлов и данных. Храните, синхронизируйте и делитесь с уверенностью.">
    <meta property="og:image" content="{{ asset('images/og-image.jpg') }}">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="ru_RU">

    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="{{ url()->current() }}">
    <meta property="twitter:title" content="{{ config('app.name', 'Laravel') }} - Cloud Storage | Облачное хранилище">
    <meta property="twitter:description"
        content="Secure cloud storage solution for your files and data. Store, sync and share with confidence. | Безопасное облачное хранилище для ваших файлов и данных. Храните, синхронизируйте и делитесь с уверенностью.">
    <meta property="twitter:image" content="{{ asset('images/og-image.jpg') }}">

    <!-- Favicon -->
    <link rel="icon" href="{{ asset('favicon.ico') }}">

    <title inertia>{{ config('app.name', 'Laravel') }} - Secure Cloud Storage | Безопасное облачное хранилище</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- Canonical URL -->
    <link rel="canonical" href="{{ url()->current() }}" />

    <!-- Additional SEO tags -->
    <meta name="geo.region" content="US">
    <meta name="geo.placename" content="United States">
    <meta name="geo.position" content="37.09024;-95.712891">
    <meta name="ICBM" content="37.09024, -95.712891">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>