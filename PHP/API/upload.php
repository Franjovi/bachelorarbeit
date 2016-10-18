<?php
session_start(); 

if (!isset($_SESSION['apiKey'])) {
    echo json_encode("Bitte loggen Sie sich ein");
    return;
}
  
$portal = $_SESSION['portal'];  //$portal = "demo.ckan.org";
$apiKey = $_SESSION['apiKey']; //$apiKey = "5cf454ce-2b61-41ae-b06d-26488ae3204e";
$apiVersion = 3;

$headers = array(
    'Accept: application/json',
    'Content-Type: application/json',
    'X-CKAN-API-Key : ' . $apiKey,
);

$authorization = false;

$metadata= array(
    "name" => $_POST['name'],
    "title" => $_POST['title'],
    "author" => $_POST['author'],
    "author_email" => $_POST['author_email'],
    "maintainer" => $_POST['maintainer'],
    "maintainer_email" => $_POST['maintainer_email'],
    "license_id" => $_POST['license_id'],
    "notes" => $_POST['notes'],
    "type" => $_POST['type'],
    /*"extras" => array(
        [
            "size" => 22
        ]
    ),*/
    "owner_org" => $_POST['owner_org'],
    "owner_display" => $_POST['owner_display'],
    "resources" => array(
        [
            "url" => $_POST['resources']
        ]
    )
);
    
#Berechtigung des Benutzers für die Organisation
$curl = curl_init();
$url = 'http://' . $portal . '/api/' . $apiVersion . '/action/organization_list_for_user';

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($code == 200) {
    $response = json_decode($response, true);   

    for ($i = 0; $i < count($response['result']); $i++) { 
        if ($response['result'][$i]['name'] == $metadata['owner_org']) $authorization = true;
    }
} 
else {
    $response = json_decode($response, true);
    print_r($response);
} 

if ($authorization) {
    $curl = curl_init();
    $url = 'http://' . $portal . '/api/' . $apiVersion . '/action/package_create';

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($metadata));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($code == 200) {
        $response = json_decode($response, true);  
                
        echo json_encode("Der Datensatz wurde erfolgreich angelegt");
        return;
    } 
    else {
        $response = json_decode($response, true);

        echo json_encode("Der Datensatz konnte nicht angelegt werden");
        return;
    }  
}
else {
    $curl = curl_init();
    $url = 'http://' . $portal . '/api/' . $apiVersion . '/action/organization_create';
    
    $organisation = array(
        "name" => strtolower($metadata["owner_org"]),
        "title" => $metadata["owner_display"]
    );
    
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($organisation));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($code == 200) {
        $response = json_decode($response, true); 
        
        $curl = curl_init();
        $url = 'http://' . $portal . '/api/' . $apiVersion . '/action/package_create';

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($metadata));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($curl);
        $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($code == 200) {
            $response = json_decode($response, true);  

            echo json_encode("Der Datensatz wurde erfolgreich angelegt");
            return;
        } 
        else {
            $response = json_decode($response, true);

            echo json_encode("Der Datensatz konnte nicht angelegt werden");
            return;
        }  
    } 
    else {
        $response = json_decode($response, true);
        echo json_encode("Bitte wählen Sie eine gültige Organisation");
    } 
}
?>