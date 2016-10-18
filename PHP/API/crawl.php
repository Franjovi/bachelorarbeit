<?php
error_reporting(E_ALL ^ E_WARNING); 
# Erhöhtes Limit für Anfragen
set_time_limit(90);

session_start(); 

if (!isset($_SESSION['apiKey'])) return;
    
$portal = $_SESSION['portal'];  
$apiKey = $_SESSION['apiKey'];  
$apiVersion = 3;

$headers = array(
    'X-CKAN-API-Key : ' . $apiKey,
);

/*******************************/    
/****** PORTALWEITE SUCHE ******/
/*******************************/  

$generalLicenses = [];
$generalOrganizationsID = [];
$generalOrganizations = [];
$generalTags = [];
$generalUsers = [];
$generalPackages = [];
$generalMaintainers = [];
$generalMaintainerMails = [];
$generalAuthors = [];
$generalAuthorMails = [];
$generalDescriptions = [];

/*** API-Anfragen ***/

# Organisationen abfragen 
$curl = curl_init();
$url = 'http://' . $portal . '/api/' . $apiVersion . '/action/organization_list';

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($code == 200) {
    $response = json_decode($response, true);
   
    for ($i = 0; $i < limit($response); $i++) {
        $generalOrganizationsID[] = $response['result'][$i];
    }
} 

#Organisationsnamen abfragen
for ($i = 0; $i < count($generalOrganizationsID); $i++) { 
    $curl = curl_init();
    $url = 'http://' . $portal . '/api/' . $apiVersion . '/action/organization_show?id=' . $generalOrganizationsID[$i];
    
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl); 

    if ($code == 200) {
        $response = json_decode($response, true);
        
        $generalOrganizations[] = $response['result']['display_name'];        
    }     
}

# Tags abfragen 
$curl = curl_init();
$url = 'http://' . $portal . '/api/' . $apiVersion . '/action/tag_list';

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($code == 200) {
    $response = json_decode($response, true);
    
    for ($i = 0; $i < limit($response); $i++) {
        $generalTags[] = $response['result'][$i];
    }
} 

# Benutzer abfragen 
$curl = curl_init();
$url = 'http://' . $portal . '/api/' . $apiVersion . '/action/user_list';

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($code == 200) {
    $response = json_decode($response, true);
    
    for ($i = 0; $i < limit($response); $i++) {
        $generalUsers[] = $response['result'][$i]['display_name'];
    }
} 

# Packages abfragen 
$curl = curl_init();
$url = 'http://' . $portal . '/api/' . $apiVersion . '/action/package_list';

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($code == 200) {
    $response = json_decode($response, true);
    
    for ($i = 0; $i < limit($response); $i++) {
        $generalPackages[] = $response['result'][$i];
    }
} 

# Package-Metadaten abfragen
for ($i = 0; $i < count($generalPackages); $i++) {
    $curl = curl_init();
    $url = 'http://' . $portal . '/api/' . $apiVersion . '/action/package_show?id=' . $generalPackages[$i];

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($code == 200) {
        $response = json_decode($response, true);
        
        # Letztbenutzte Werte in Array speichern und doppelte Werte vermeiden
        if (!in_array($response['result']['license_title'], $generalLicenses)) {
            $generalLicenses[] = $response['result']['license_title'];    
        }
         
        if (!in_array($response['result']['maintainer'], $generalMaintainers)) {
            $generalMaintainers[] = $response['result']['maintainer'];    
        }
        
        if (!in_array($response['result']['maintainer_email'], $generalMaintainerMails)) {
            $generalMaintainerMails[] = $response['result']['maintainer_email'];    
        }

        if (!in_array($response['result']['author'], $generalAuthors)) {
            $generalAuthors[] = $response['result']['author'];    
        }

        if (!in_array($response['result']['author_email'], $generalAuthorMails)) {
            $generalAuthorMails[] = $response['result']['author_email'];    
        }
        
        if (!in_array($response['result']['notes'], $generalDescriptions)) {
            $generalDescriptions[] = $response['result']['notes'];    
        }

        /*if (!in_array($response['result']['resources'][0]['description'], $generalDescriptions)) {
            $generalDescriptions[] = $response['result']['resources'][0]['description'];    
        }*/
    }         
}

# Lizenzen abfragen
$curl = curl_init();
$url = 'http://' . $portal . '/api/' . $apiVersion . '/action/license_list';

curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($code == 200) {
    $response = json_decode($response, true);

    for ($i = 0; $i < limit($response); $i++) {
        if (!in_array($response['result'][$i]['title'], $generalLicenses)) {
            $generalLicenses[] = $response['result'][$i]['title'];
        }
    }
} 

/*********************************/    
/****** ORGANISATIONSWEITE SUCHE ******/
/*********************************/ 

$userOrganizationsID = [];
$userOrganizations = [];
$organizationTitles = [];
$organizationLicenses = [];
$organizationMaintainers = [];
$organizationMaintainerMails = [];
$organizationAuthors = [];
$organizationAuthorMails = [];

# Organisationen abfragen
$curl = curl_init();
$url = 'http://' . $portal . '/api/' . $apiVersion . '/action/organization_list_for_user';

curl_setopt($curl, CURLOPT_URL, $url);

# API-Key zur Authentifizierung angeben
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($curl);
$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
curl_close($curl);

if ($code == 200) {
    $response = json_decode($response, true);

    for ($i = 0; $i < limit($response); $i++) {
        $userOrganizationsID[] = $response['result'][$i]['name'];  
        $userOrganizations[] = $response['result'][$i]['display_name']; 
    }
} 

# Organisationsdetails mit zugehörigen Datensätzen abfragen
for ($i = 0; $i < count($userOrganizations); $i++) {
    $curl = curl_init();
    $url = 'http://' . $portal . '/api/' . $apiVersion . '/action/organization_show?id=' . $userOrganizationsID[$i] . "&include_datasets=true";

    curl_setopt($curl, CURLOPT_URL, $url);

    # API-Key zur Authentifizierung angeben
    curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($curl);
    $code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($code == 200) {
        $response = json_decode($response, true);
  
        $packageCount = count($response['result']['packages']);
        
        for ($j = 0; $j < $packageCount; $j++) {
            if (!in_array($response['result']['packages'][$j]['title'], $organizationTitles)) {
                $organizationTitles[] = $response['result']['packages'][$j]['title'];    
            }
            
            if (!in_array($response['result']['packages'][$j]['maintainer'], $organizationMaintainers)) {
                $organizationMaintainers[] = $response['result']['packages'][$j]['maintainer'];    
            }  
            
            if (!in_array($response['result']['packages'][$j]['maintainer_email'], $organizationMaintainerMails)) {
                $organizationMaintainerMails[] = $response['result']['packages'][$j]['maintainer_email'];    
            }           
            
            if (!in_array($response['result']['packages'][$j]['author'], $organizationAuthors)) {
                $organizationAuthors[] = $response['result']['packages'][$j]['author'];    
            }
            
            if (!in_array($response['result']['packages'][$j]['author_email'], $organizationAuthorMails)) {
                $organizationAuthorMails[] = $response['result']['packages'][$j]['author_email'];    
            }
            
            if (!in_array($response['result']['packages'][$j]['license_title'], $organizationLicenses)) {
                $organizationLicenses[] = $response['result']['packages'][$j]['license_title'];    
            }
        }
    }     
}

$collectedTags = [
    $generalOrganizations,
    $generalTags,
    $generalUsers,
    $generalPackages,   
    $generalLicenses,
    $generalMaintainers,
    $generalMaintainerMails,
    $generalAuthors,
    $generalAuthorMails,
    $generalDescriptions,
    $userOrganizations,
    $organizationTitles,
    $organizationLicenses,
    $organizationMaintainers,
    $organizationMaintainerMails,
    $organizationAuthors,
    $organizationAuthorMails
];

echo json_encode($collectedTags);


/* Maximal 20 Datensätze retournieren */
function limit($response) {
    $limit = (count($response['result']) > 20) ? 20 : count($response['result']);
    return $limit;
}
?> 