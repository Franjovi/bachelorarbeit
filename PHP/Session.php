<?php
session_start();

$portal = $_POST['portal'];
$apiKey = $_POST['apiKey'];

if (!isset($_SESSION['apiKey'])) {
    if ($apiKey == "") {
        echo json_encode("Bitte geben Sie einen API-Key ein");
        return;
    }
    else if (strlen($apiKey) < 15) {
        echo json_encode("Der API-Key ist nicht gültig");
        return;    
    }
    
    $_SESSION['portal'] = $portal;
    $_SESSION['apiKey'] = $apiKey;
    
    echo json_encode("Sie haben sich erfolgreich eingeloggt");
}
else echo json_encode("Sie sind bereits eingeloggt");
?>