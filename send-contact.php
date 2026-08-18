<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  header("Location: index.html#contacto");
  exit;
}

$honeypot = trim($_POST["empresa_web"] ?? "");
if ($honeypot !== "") {
  header("Location: index.html?contacto=enviado#contacto");
  exit;
}

function clean_input($data) {
  $data = strip_tags($data);
  $data = str_replace(array("\r", "\n"), " ", $data);
  return trim($data);
}

$correo = filter_var(trim($_POST["correo"] ?? ""), FILTER_SANITIZE_EMAIL);
$correo = str_replace(array("\r", "\n"), "", $correo);
$telefono = clean_input($_POST["telefono"] ?? "");
$servicio = clean_input($_POST["servicio"] ?? "");
$mensaje = trim(strip_tags($_POST["mensaje"] ?? ""));

if (
  empty($correo) ||
  empty($telefono) ||
  empty($servicio) ||
  empty($mensaje) ||
  !filter_var($correo, FILTER_VALIDATE_EMAIL)
) {
  header("Location: index.html?contacto=error#contacto");
  exit;
}

$to = "contacto@cematiz.com.mx";
$subject = "SOLICITUD DE CONTACTO WEB CEMATIZ";

$body = "Nueva solicitud enviada desde la página web de CEMATIZ.\n\n";
$body .= "Correo: " . $correo . "\n";
$body .= "Teléfono: " . $telefono . "\n";
$body .= "Servicio de interés: " . $servicio . "\n\n";
$body .= "Mensaje:\n" . $mensaje . "\n";

$headers = "From: contacto@cematiz.com.mx\r\n";
$headers .= "Reply-To: " . $correo . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
  header("Location: index.html?contacto=enviado#contacto");
  exit;
}

header("Location: index.html?contacto=error#contacto");
exit;
