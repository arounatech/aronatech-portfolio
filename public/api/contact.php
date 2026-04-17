<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

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

function respond(int $status, string $message, array $extra = []): void
{
    http_response_code($status);
    echo json_encode(array_merge(['message' => $message], $extra), JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, 'Method not allowed.');
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

$name = trim((string) ($payload['name'] ?? ''));
$email = trim((string) ($payload['email'] ?? ''));
$subject = trim((string) ($payload['subject'] ?? ''));
$message = trim((string) ($payload['message'] ?? ''));
$website = trim((string) ($payload['website'] ?? ''));

if ($website !== '') {
    // Honeypot field: pretend success without sending.
    respond(200, 'Message accepted.');
}

if ($name === '' || mb_strlen($name) < 2 || mb_strlen($name) > 120) {
    respond(422, 'Invalid sender name.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 180) {
    respond(422, 'Invalid sender email.');
}

if ($subject === '' || mb_strlen($subject) < 4 || mb_strlen($subject) > 180) {
    respond(422, 'Invalid subject.');
}

if ($message === '' || mb_strlen($message) < 12 || mb_strlen($message) > 2000) {
    respond(422, 'Invalid message body.');
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
    respond(429, 'Please wait a few seconds before trying again.');
}

if (count($requestTimes) >= $maxRequests) {
    respond(429, 'Too many requests. Please try again later.');
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
    respond(500, 'Mail dependency is missing. Install PHPMailer with Composer.');
}

require_once $autoloadPath;

if (!class_exists(\PHPMailer\PHPMailer\PHPMailer::class)) {
    respond(500, 'PHPMailer not available.');
}

loadMailEnv();

$smtpHost = envValue('MAIL_HOST');
$smtpPort = (int) envValue('MAIL_PORT', '587');
$smtpUser = envValue('MAIL_USERNAME');
$smtpPass = envValue('MAIL_PASSWORD');
$smtpEncryption = strtolower(envValue('MAIL_ENCRYPTION', 'tls'));
$fromAddress = envValue('MAIL_FROM_ADDRESS', $smtpUser);
$fromName = envValue('MAIL_FROM_NAME', 'Portfolio Contact');
$toAddress = envValue('MAIL_TO_ADDRESS', $fromAddress);
$toName = envValue('MAIL_TO_NAME', 'Portfolio Owner');

if ($smtpHost === '' || $smtpUser === '' || $smtpPass === '' || $fromAddress === '' || $toAddress === '') {
    respond(500, 'SMTP settings are incomplete on the server.');
}

try {
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $smtpHost;
    $mail->Port = $smtpPort;
    $mail->SMTPAuth = true;
    $mail->Username = $smtpUser;
    $mail->Password = $smtpPass;
    $mail->CharSet = 'UTF-8';

    if ($smtpEncryption === 'ssl') {
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    } else {
        $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    }

    $mail->setFrom($fromAddress, $fromName);
    $mail->addAddress($toAddress, $toName);
    $mail->addReplyTo($email, $name);
    $mail->Subject = '[Portfolio Contact] ' . $subject;
    $mail->isHTML(false);

    $safeMessage = preg_replace("/\r\n|\r|\n/", PHP_EOL, $message) ?: $message;
    $body = "You received a new portfolio contact message." . PHP_EOL . PHP_EOL
        . "Name: {$name}" . PHP_EOL
        . "Email: {$email}" . PHP_EOL
        . "Subject: {$subject}" . PHP_EOL
        . "IP: {$clientIp}" . PHP_EOL
        . "Timestamp: " . gmdate('c') . PHP_EOL . PHP_EOL
        . "Message:" . PHP_EOL
        . $safeMessage . PHP_EOL;

    $mail->Body = $body;
    $mail->send();
    respond(200, 'Message sent successfully.');
} catch (\Throwable $exception) {
    error_log('Portfolio mail error: ' . $exception->getMessage());
    respond(500, 'Unable to send message right now.');
}
