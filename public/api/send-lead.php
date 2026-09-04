<?php
// ==============================================================================
// YASIR JAMAL - DIRECT LEAD INGESTION & EMAIL NOTIFICATION API
// Dispatches immediate executive lead notifications to yj.digitall@gmail.com
// ==============================================================================

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$to = 'yj.digitall@gmail.com';
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);
if (!$data) { 
    $data = $_POST; 
}

$name = htmlspecialchars(trim($data['name'] ?? 'Anonymous Prospect'));
$email = htmlspecialchars(trim($data['email'] ?? 'Not provided'));
$phone = htmlspecialchars(trim($data['whatsapp'] ?? $data['phone'] ?? 'Not provided'));
$website = htmlspecialchars(trim($data['website_url'] ?? $data['website'] ?? ''));
$message = htmlspecialchars(trim($data['message'] ?? $data['project_details'] ?? ''));
$page = htmlspecialchars(trim($data['page'] ?? $_SERVER['HTTP_REFERER'] ?? '/'));
$source = htmlspecialchars(trim($data['source'] ?? 'Direct Visit'));
$subjectHeader = htmlspecialchars(trim($data['_subject'] ?? ''));

if (!$subjectHeader) {
    if ($website) {
        $subjectHeader = '🎬 [VIDEO TEARDOWN] ' . $name . ' (' . $website . ')';
    } elseif ($phone !== 'Not provided') {
        $subjectHeader = '🔥 [WHATSAPP LEAD] ' . $name . ' (' . $phone . ')';
    } else {
        $subjectHeader = '⚡ [NEW INQUIRY] ' . $name;
    }
}

$receivedAt = date('l, F j, Y \a\t g:i A') . ' (UAE Time: UTC+4)';

// Build clean executive HTML lead notification
$html = '<!DOCTYPE html><html><head><meta charset="utf-8">' .
'<style>' .
'body { font-family: -apple-system, BlinkMacSystemFont, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }' .
'.card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }' .
'.header { background: #01013E; padding: 24px; color: #ffffff; }' .
'.header h2 { margin: 0; font-size: 18px; font-weight: 700; color: #ffffff; }' .
'.header p { margin: 4px 0 0 0; font-size: 12px; color: #94a3b8; }' .
'.body { padding: 24px; }' .
'.field-row { margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #f1f5f9; }' .
'.field-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }' .
'.label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 4px; }' .
'.value { font-size: 15px; font-weight: 600; color: #0f172a; }' .
'.value-link { color: #1559E7; text-decoration: none; }' .
'.btn-reply { display: inline-block; background: #01013E; color: #ffffff !important; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; margin-top: 16px; }' .
'.footer { background: #f8fafc; padding: 14px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }' .
'</style></head><body>' .
'<div class="card">' .
'<div class="header"><h2>New Website Lead Received</h2><p>' . $receivedAt . '</p></div>' .
'<div class="body">' .
'<div class="field-row"><div class="label">Prospect Name</div><div class="value">' . $name . '</div></div>' .
'<div class="field-row"><div class="label">Work Email</div><div class="value"><a class="value-link" href="mailto:' . $email . '">' . $email . '</a></div></div>' .
'<div class="field-row"><div class="label">WhatsApp / Phone</div><div class="value">' . ($phone !== 'Not provided' ? '<a class="value-link" href="https://wa.me/' . preg_replace('/[^0-9]/', '', $phone) . '">' . $phone . '</a>' : 'Not provided') . '</div></div>';

if ($website) {
    $html .= '<div class="field-row"><div class="label">Target Website URL</div><div class="value"><a class="value-link" href="' . (strpos($website, 'http') === 0 ? $website : 'https://' . $website) . '" target="_blank">' . $website . '</a></div></div>';
}

if ($message) {
    $html .= '<div class="field-row"><div class="label">Project Details / Message</div><div class="value" style="font-weight: 400; line-height: 1.5;">' . nl2br($message) . '</div></div>';
}

$html .= '<div class="field-row"><div class="label">Lead Origin &amp; Page</div><div class="value" style="font-size: 12px; font-weight: 400; color: #64748b;">Page: ' . $page . ' &bull; Source: ' . $source . '</div></div>' .
'<a href="mailto:' . $email . '?subject=Re: ' . urlencode($subjectHeader) . '" class="btn-reply">Reply to ' . $name . ' &rarr;</a>' .
'</div><div class="footer">Yasir Jamal Lead Ingestion Engine &bull; yasirjamal.com</div></div></body></html>';

$from = 'Yasir Jamal Website <info@yasirjamal.com>';
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type:text/html;charset=UTF-8\r\n";
$headers .= "From: " . $from . "\r\n";
if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
} else {
    $headers .= "Reply-To: info@yasirjamal.com\r\n";
}
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = @mail($to, $subjectHeader, $html, $headers);

echo json_encode([
    'success' => $sent,
    'message' => $sent ? 'Lead email dispatched directly to yj.digitall@gmail.com' : 'Mail transport error',
    'timestamp' => time()
]);
?>
