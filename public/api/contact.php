<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; base-uri 'none';");

/**
 * Shared-hosting friendly environment loader.
 * Supports server variables and optional .env.mail file fallback.
 */
function loadMailEnv(): void
{
    $candidates = [
        __DIR__ . '/../../.env.mail',
        __DIR__ . '/../../.env',
        __DIR__ . '/../.env.mail',
        __DIR__ . '/../.env',
        __DIR__ . '/.env.mail',
        __DIR__ . '/.env',
    ];

    foreach ($candidates as $path) {
        if (!is_file($path) || !is_readable($path)) {
            continue;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!is_array($lines)) {
            continue;
        }

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if ($trimmed === '' || str_starts_with($trimmed, '#')) {
                continue;
            }

            if (str_starts_with($trimmed, 'export ')) {
                $trimmed = trim(substr($trimmed, 7));
            }

            $parts = explode('=', $trimmed, 2);
            if (count($parts) !== 2) {
                continue;
            }

            $key = trim($parts[0]);
            $value = trim($parts[1]);
            if ($key === '') {
                continue;
            }

            $value = trim($value, "\"'");
            if (getenv($key) === false) {
                if (function_exists('putenv')) {
                    @putenv("{$key}={$value}");
                }
                $_ENV[$key] = $value;
                $_SERVER[$key] = $value;
            }
        }

        // First matched file wins.
        break;
    }
}

function envValue(string $key, string $default = ''): string
{
    $value = getenv($key);
    if ($value !== false && $value !== '') {
        return (string) $value;
    }
    if (!empty($_ENV[$key])) {
        return (string) $_ENV[$key];
    }
    if (!empty($_SERVER[$key])) {
        return (string) $_SERVER[$key];
    }
    return $default;
}

function envBool(string $key, bool $default = false): bool
{
    $value = strtolower(envValue($key, $default ? 'true' : 'false'));
    return in_array($value, ['1', 'true', 'yes', 'on'], true);
}

function sanitizeLine(string $value, int $maxLen): string
{
    $clean = trim(str_replace(["\r", "\n"], ' ', strip_tags($value)));
    return mb_substr($clean, 0, $maxLen);
}

function sanitizeMessage(string $value, int $maxLen): string
{
    $clean = trim(str_replace("\0", '', $value));
    return mb_substr($clean, 0, $maxLen);
}

function requestOriginAllowed(): bool
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin === '') {
        return true;
    }

    $originHost = parse_url($origin, PHP_URL_HOST);
    $currentHost = $_SERVER['HTTP_HOST'] ?? '';
    if ($originHost && $currentHost && strcasecmp($originHost, $currentHost) === 0) {
        return true;
    }

    $allowed = array_filter(array_map('trim', explode(',', envValue('MAIL_ALLOWED_ORIGINS', ''))));
    foreach ($allowed as $item) {
        if (strcasecmp($item, $origin) === 0 || strcasecmp($item, (string) $originHost) === 0) {
            return true;
        }
    }

    return false;
}

function respond(int $status, string $message, array $extra = []): void
{
    http_response_code($status);
    echo json_encode(array_merge(['message' => $message], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

function appIsProduction(): bool
{
    $env = strtolower(envValue('MAIL_APP_ENV', envValue('APP_ENV', 'production')));
    return !in_array($env, ['dev', 'development', 'local', 'test', 'testing'], true);
}

function failResponse(int $status, string $devMessage, string $prodMessage = 'Failed to send message.'): void
{
    if (appIsProduction()) {
        respond($status, $prodMessage);
    }
    respond($status, $devMessage);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    failResponse(405, 'Method not allowed.');
}

if (!requestOriginAllowed()) {
    failResponse(403, 'Forbidden origin.');
}

if (((int) ($_SERVER['CONTENT_LENGTH'] ?? 0)) > 20000) {
    failResponse(413, 'Payload too large.');
}

if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') {
    // Allowed in case TLS is terminated before Apache (common in shared hosting/CDN).
    header('X-Warning: Request may be insecure if TLS is not terminated upstream.');
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '', true);

if (!is_array($payload)) {
    $payload = $_POST;
}

$name = sanitizeLine((string) ($payload['name'] ?? ''), 120);
$email = trim((string) ($payload['email'] ?? ''));
$subject = sanitizeLine((string) ($payload['subject'] ?? ''), 180);
$message = sanitizeMessage((string) ($payload['message'] ?? ''), 2000);

if ($name === '' || mb_strlen($name) < 2 || mb_strlen($name) > 120) {
    failResponse(422, 'Invalid sender name.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 180) {
    failResponse(422, 'Invalid sender email.');
}

if ($subject === '' || mb_strlen($subject) < 4 || mb_strlen($subject) > 180) {
    failResponse(422, 'Invalid subject.');
}

if ($message === '' || mb_strlen($message) < 12 || mb_strlen($message) > 2000) {
    failResponse(422, 'Invalid message body.');
}

$clientIp = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$windowSeconds = 600;
$maxRequests = 4;
$cooldownSeconds = 15;
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'portfolio_contact_' . md5($clientIp) . '.json';

$requestTimes = [];
if (is_file($rateFile)) {
    $existing = json_decode((string) file_get_contents($rateFile), true);
    if (is_array($existing)) {
        $requestTimes = array_values(array_filter(
            $existing,
            static fn ($timestamp) => is_int($timestamp) && $timestamp > (time() - $windowSeconds)
        ));
    }
}

if (!empty($requestTimes) && (time() - end($requestTimes)) < $cooldownSeconds) {
    failResponse(429, 'Please wait a few seconds before trying again.');
}

if (count($requestTimes) >= $maxRequests) {
    failResponse(429, 'Too many requests. Please try again later.');
}

$requestTimes[] = time();
@file_put_contents($rateFile, json_encode($requestTimes), LOCK_EX);

$autoloadCandidates = [
    __DIR__ . '/../../vendor/autoload.php',
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/vendor/autoload.php',
];

$autoloadPath = null;
foreach ($autoloadCandidates as $candidate) {
    if (is_file($candidate)) {
        $autoloadPath = $candidate;
        break;
    }
}

if ($autoloadPath === null) {
    failResponse(500, 'Mail dependency is missing. Install PHPMailer with Composer.');
}

require_once $autoloadPath;

if (!class_exists(\PHPMailer\PHPMailer\PHPMailer::class)) {
    failResponse(500, 'PHPMailer not available.');
}

$templatePath = __DIR__ . '/templates/mailTemplates.php';
if (!is_file($templatePath)) {
    failResponse(500, 'Mail templates are missing.');
}
require_once $templatePath;

loadMailEnv();

$smtpHost = envValue('MAIL_HOST');
$smtpPort = (int) envValue('MAIL_PORT', '587');
$smtpUser = envValue('MAIL_USERNAME');
$smtpPass = envValue('MAIL_PASSWORD');
$smtpEncryption = strtolower(envValue('MAIL_ENCRYPTION', 'none'));
$smtpAuth = envBool('MAIL_SMTP_AUTH', false);
$fromAddress = envValue('MAIL_FROM_ADDRESS', $smtpUser);
$fromName = envValue('MAIL_FROM_NAME', 'AronaTech Portfolio');
$siteName = envValue('MAIL_SITE_NAME', 'AronaTech Portfolio');
$siteUrl = envValue('MAIL_SITE_URL', 'https://' . ($_SERVER['HTTP_HOST'] ?? 'localhost'));

if ($smtpHost === '' || $fromAddress === '') {
    failResponse(500, 'SMTP settings are incomplete on the server.');
}

if ($smtpAuth && ($smtpUser === '' || $smtpPass === '')) {
    failResponse(500, 'SMTP auth is enabled but username/password are missing.');
}

try {
    $submittedAt = gmdate('Y-m-d H:i:s \U\T\C');
    $userAgent = sanitizeLine((string) ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown'), 350);

    $templateData = [
        'name' => $name,
        'email' => $email,
        'subject' => $subject,
        'message' => $message,
        'ip' => $clientIp,
        'userAgent' => $userAgent,
        'submittedAt' => $submittedAt,
        'siteName' => $siteName,
        'siteUrl' => $siteUrl,
    ];

    $ownerTemplate = buildOwnerNotificationTemplate($templateData);
    $senderTemplate = buildSenderConfirmationTemplate($templateData);

    $configureMailer = static function (\PHPMailer\PHPMailer\PHPMailer $mail) use (
        $smtpHost,
        $smtpPort,
        $smtpAuth,
        $smtpUser,
        $smtpPass,
        $smtpEncryption
    ): void {
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->Port = $smtpPort;
        $mail->SMTPAuth = $smtpAuth;
        if ($smtpAuth) {
            $mail->Username = $smtpUser;
            $mail->Password = $smtpPass;
        }
        $mail->CharSet = 'UTF-8';
        $mail->Timeout = 15;
        $mail->SMTPKeepAlive = false;

        if ($smtpEncryption === 'ssl') {
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        } elseif ($smtpEncryption === 'tls') {
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        } else {
            $mail->SMTPSecure = false;
            $mail->SMTPAutoTLS = false;
        }
    };

    $ownerMailer = new \PHPMailer\PHPMailer\PHPMailer(true);
    $configureMailer($ownerMailer);
    $ownerMailer->setFrom($fromAddress, $fromName);
    $ownerMailer->addAddress($fromAddress, $fromName);
    $ownerMailer->addReplyTo($email, $name);
    $ownerMailer->Subject = '[Portfolio Contact] ' . $subject;
    $ownerMailer->isHTML(true);
    $ownerMailer->Body = $ownerTemplate['html'];
    $ownerMailer->AltBody = $ownerTemplate['text'];
    $ownerMailer->send();

    $senderMailer = new \PHPMailer\PHPMailer\PHPMailer(true);
    $configureMailer($senderMailer);
    $senderMailer->setFrom($fromAddress, $fromName);
    $senderMailer->addAddress($email, $name);
    $senderMailer->Subject = 'We received your message';
    $senderMailer->isHTML(true);
    $senderMailer->Body = $senderTemplate['html'];
    $senderMailer->AltBody = $senderTemplate['text'];
    $senderMailer->send();

    respond(200, 'Message sent successfully.');
} catch (\Throwable $exception) {
    error_log('Portfolio mail error: ' . $exception->getMessage());
    failResponse(500, 'Unable to send message right now.');
}
