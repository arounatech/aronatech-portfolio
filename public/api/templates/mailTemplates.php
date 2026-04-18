<?php

declare(strict_types=1);

function mailTemplateEscape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function mailTemplateShell(string $title, string $subtitle, string $contentHtml, string $footerHtml): string
{
    $safeTitle = mailTemplateEscape($title);
    $safeSubtitle = mailTemplateEscape($subtitle);

    return <<<HTML
<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#070b1f;font-family:Inter,Segoe UI,Arial,sans-serif;color:#e8ecff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#070b1f;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" style="width:100%;max-width:640px;background:linear-gradient(145deg,#0f1435,#0a0f29);border:1px solid #2b3265;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 18px;background:radial-gradient(circle at right top,rgba(108,99,255,.25),transparent 48%);">
                <div style="display:inline-block;padding:6px 10px;border:1px solid rgba(167,139,250,.45);border-radius:999px;color:#b8a7ff;font-size:12px;letter-spacing:.7px;text-transform:uppercase;">
                  AronaTech Portfolio
                </div>
                <h1 style="margin:14px 0 6px;font-size:26px;line-height:1.2;color:#eef2ff;">{$safeTitle}</h1>
                <p style="margin:0;color:#aeb7df;font-size:14px;line-height:1.6;">{$safeSubtitle}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 28px 8px;">
                {$contentHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:10px 28px 26px;color:#8f99c6;font-size:12px;line-height:1.6;">
                {$footerHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
HTML;
}

function buildOwnerNotificationTemplate(array $data): array
{
    $name = mailTemplateEscape((string) ($data['name'] ?? ''));
    $email = mailTemplateEscape((string) ($data['email'] ?? ''));
    $subject = mailTemplateEscape((string) ($data['subject'] ?? ''));
    $message = nl2br(mailTemplateEscape((string) ($data['message'] ?? '')));
    $ip = mailTemplateEscape((string) ($data['ip'] ?? 'unknown'));
    $userAgent = mailTemplateEscape((string) ($data['userAgent'] ?? 'unknown'));
    $submittedAt = mailTemplateEscape((string) ($data['submittedAt'] ?? ''));

    $content = <<<HTML
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
  <tr><td style="padding:0 0 14px;color:#c8cff0;font-size:14px;">A new message was submitted from your portfolio contact form.</td></tr>
  <tr><td style="padding:0 0 14px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(255,255,255,.03);border:1px solid #293267;border-radius:12px;">
      <tr><td style="padding:14px 16px;color:#d9def8;font-size:13px;line-height:1.65;">
        <strong style="color:#f4f6ff;">From:</strong> {$name} &lt;{$email}&gt;<br>
        <strong style="color:#f4f6ff;">Subject:</strong> {$subject}<br>
        <strong style="color:#f4f6ff;">Submitted:</strong> {$submittedAt}<br>
        <strong style="color:#f4f6ff;">IP:</strong> {$ip}<br>
        <strong style="color:#f4f6ff;">User Agent:</strong> {$userAgent}
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:0 0 16px;color:#aeb7df;font-size:12px;text-transform:uppercase;letter-spacing:.6px;">Message</td></tr>
  <tr><td style="padding:14px 16px;background:#0a1030;border:1px solid #293267;border-radius:12px;color:#e7ebff;font-size:14px;line-height:1.75;">{$message}</td></tr>
</table>
HTML;

    $footer = 'Tip: use Reply in your mail client to answer directly to the sender.';
    $html = mailTemplateShell('New Contact Request', 'Lead generated from your portfolio.', $content, $footer);

    $text = "New contact request\n\n"
        . "From: {$data['name']} <{$data['email']}>\n"
        . "Subject: {$data['subject']}\n"
        . "Submitted: {$data['submittedAt']}\n"
        . "IP: {$data['ip']}\n"
        . "User Agent: {$data['userAgent']}\n\n"
        . "Message:\n{$data['message']}\n";

    return ['html' => $html, 'text' => $text];
}

function buildSenderConfirmationTemplate(array $data): array
{
    $senderName = mailTemplateEscape((string) ($data['name'] ?? 'there'));
    $subject = mailTemplateEscape((string) ($data['subject'] ?? 'your message'));
    $siteName = mailTemplateEscape((string) ($data['siteName'] ?? 'AronaTech Portfolio'));
    $siteUrl = mailTemplateEscape((string) ($data['siteUrl'] ?? '#'));

    $content = <<<HTML
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
  <tr><td style="padding:0 0 14px;color:#c8cff0;font-size:14px;line-height:1.7;">
    Hi {$senderName},<br><br>
    Thanks for reaching out to <strong style="color:#f3f6ff;">{$siteName}</strong>. Your message was received successfully.
  </td></tr>
  <tr><td style="padding:0 0 14px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:rgba(255,255,255,.03);border:1px solid #293267;border-radius:12px;">
      <tr><td style="padding:14px 16px;color:#d9def8;font-size:13px;line-height:1.7;">
        <strong style="color:#f4f6ff;">Your subject:</strong> {$subject}<br>
        <strong style="color:#f4f6ff;">Received:</strong> {$data['submittedAt']}<br>
        <strong style="color:#f4f6ff;">Expected response:</strong> within 24-48 hours
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:2px 0 0;">
    <a href="{$siteUrl}" style="display:inline-block;padding:10px 16px;background:linear-gradient(135deg,#6c63ff,#38bdf8);color:#fff;text-decoration:none;border-radius:999px;font-size:13px;font-weight:600;">
      Visit {$siteName}
    </a>
  </td></tr>
</table>
HTML;

    $footer = 'This is an automated confirmation email. Please do not share sensitive credentials by email.';
    $html = mailTemplateShell('Message Received', 'Thank you for contacting us.', $content, $footer);

    $text = "Hi {$data['name']},\n\n"
        . "Thank you for contacting {$data['siteName']}.\n"
        . "We received your message (subject: {$data['subject']}) on {$data['submittedAt']}.\n"
        . "We will get back to you within 24-48 hours.\n\n"
        . "Site: {$data['siteUrl']}\n";

    return ['html' => $html, 'text' => $text];
}
