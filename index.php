<?php 
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); 
header("Access-Control-Allow-Headers: X-Requested-With");

session_start(); 
?>

<!DOCTYPE html>
<html>

<head>
    <title>Open Data Assistant</title>

    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta name="description" content="" />
    <meta name="author" content="" />
    <meta name="keywords" content="Open Data, WU, Open Source, Assistant, CKAN" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">

    <link href="CSS/mobile.css" type="text/css" rel="stylesheet" media="only screen and (min-width: 320px) and (-webkit-min-device-pixel-ratio: 1)" />    
    <link href="CSS/desktop.css" type="text/css" rel="stylesheet" media="only screen and (min-width: 980px)" />
    <link href="Images/Thumbnails/assistant.ico" type="image/x-icon" rel="shortcut icon">
    
    <!-- Einbindung jQuery + Zentralskript -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="JS/File.js"></script>
    <script src="JS/Suggestion.js"></script>
    <script src="JS/open-data.js"></script>
    
    <!-- Einbindung Datei-Bibliotheken -->
    <script src="JS/FileReader/jquery.FileReader.min.js"></script>
    
    <!-- Einbindung Parsing-Bibliotheken -->
    <script src="JS/JS-XLS/xls.js"></script>
    <!--<script src="JS/JS-XLSX/xlsx.js"></script>-->
    <script src="JS/PapaParse/papaparse.min.js"></script>
    <script src="JS/PDF.JS/build/pdf.js"></script>
    
    <!-- Einbindung Analyse-Bibliotheken -->
    <script src="JS/AnalyseDatasets/csv.js"></script>
    <script src="JS/AnalyseDatasets/json.js"></script>
    <script src="JS/AnalyseDatasets/pdf.js"></script>
    <script src="JS/AnalyseDatasets/txt.js"></script>
    <script src="JS/AnalyseDatasets/xls.js"></script>
    <script src="JS/AnalyseDatasets/xml.js"></script>
    
    <!-- Einbindung Datenbankinteraktion -->
    <script src="JS/API/crawl.js"></script>
</head>

<body>
    <header class="navbar container">
        <a class="logo" href="index.html">
            <img src="Images/Thumbnails/open-logo.png" class="logo" alt="Open Data Wirtschaftsuniversität Wien" />
        </a>
        <nav class="navigation">
            <ul>
                <!--<li>
                    <a href="#">Datensätze</a>
                </li>
                <li>
                    <a href="#">Organisationen</a>
                </li>
                <li>
                    <a href="#">Gruppen</a>
                </li>
                <li>
                    <a href="#">Über CKAN</a>
                </li>-->
                <li>
                    <a href="#" class="login">Login</a>
                </li>   
            </ul>
        </nav>    
    </header>  
    
    <?php include 'PHP/Modal.php'; ?>

    <section class="content container-fluid">
        <div class="form-wrapper container">
            <form class="create-dataset">
                <legend>Datensatz erstellen</legend>
                <ol>
                    <li>
                        <label for="source">Datenquelle</label>
                        <input type="file" name="source" id="source" class="metadata excluded" />
                    </li>
                    <li>
                        <label for="title">Titel</label>
                        <input type="text" name="title" id="title" placeholder="Name des Datensatzes" class="metadata" />
                    </li>
                    <li>
                        <label for="description">Beschreibung</label>
                        <textarea name="description" id="description" placeholder="Informationen über den Datensatz" class="metadata"></textarea>
                    </li>
                    <li>
                        <label for="tag">Tags</label>
                        <input type="text" name="tag" id="tag" placeholder="z.B.: Wirtschaft, Politik"  class="metadata" />
                    </li>
                    <li>
                        <label for="license">Lizenz</label>
                        <select name="license" id="license" class="metadata">
                            <option value="other-at">Andere (Namensnennung)</option>
                            <option value="other-open">Andere (Offen)</option>
                            <option value="other-pd">Andere (gemeinfrei)</option>
                            <option value="other-closed">Andere (nicht offen)</option>
                            <option value="other-nc">Andere (nicht-kommerziell)</option>
                            <option value="cc-by">Creative Commons Attribution</option>
                            <option value="cc-by-sa">Creative Commons Attribution Share-Alike</option>
                            <option value="cc-zero">Creative Commons CCZero</option>
                            <option value="cc-nc">Creative Commons Non-Commercial (Alle)</option>
                            <option value="gfdl">GNU Free Documentation License</option>
                            <option value="notspecified">Lizenz nicht angegeben</option>
                            <option value="odc-by">Open Data Commons Attribution License</option>
                            <option value="odc-odbl">Open Data Commons Open Database License (ODbL)</option>
                            <option value="odc-pddl">Open Data Commons Public Domain Dedication and License (PDDL)</option>
                            <option value="uk-ogl">UK Open Government Licence (OGL)</option>
                        </select>
                    </li>
                    <li>
                        <label for="organisation">Organisation</label>
                        <input type="text" name="organisation" id="organisation" class="metadata" placeholder="Name der Organisation">
                        <!--
                        <select name="organisation" id="organisation" class="metadata">
                            <option value="wu">WU</option>
                        </select>-->
                    </li>
                    <li>
                        <label for="visibility">Sichtbarkeit</label>
                        <select name="visibility" id="visibility" class="metadata">
                            <option value="public">Öffentlich</option>
                            <option value="private">Privat</option>
                        </select>
                    </li>
                    <li>
                        <label for="version">Version</label>
                        <input type="text" name="version" id="version" placeholder="1.0" class="metadata" />
                    </li>
                    <li>
                        <label for="data-format">Dateiformat</label>
                        <select name="data-format" id="data-format" class="metadata excluded">
                            <option value="csv">CSV</option>
                            <option value="json">JSON</option>
                            <option value="pdf">PDF</option>
                            <option value="txt">TXT</option>
                            <option value="xls">XLS</option>
                            <option value="xml">XML</option>
                            <option value="zip">ZIP</option>
                        </select>
                    </li>
                    <li>
                        <label for="file-size">Dateigröße</label>
                        <input type="text" name="file-size" id="file-size" placeholder="MB" class="metadata excluded" />
                    </li>
                    <li>
                        <label for="author">Author</label>
                        <input type="text" name="author" id="author" placeholder="Peter Open" class="metadata" />
                    </li>
                    <li>
                        <label for="email-author">E-Mail Author</label>
                        <input type="email" name="email-author" id="email-author" placeholder="peter.open@open-peter.at" class="metadata" />
                    </li>
                    <li>
                        <label for="maintainer">Verantwortlicher</label>
                        <input type="text" name="maintainer" id="maintainer" placeholder="Peter Open" class="metadata" />
                    </li>
                    <li>
                        <label for="email-maintainer">E-Mail Verantwortlicher</label>
                        <input type="email" name="email-maintainer" id="email-maintainer" placeholder="peter.open@open-peter.at" class="metadata" />
                    </li>
                    <li>
                        <button type="submit" name="submit-dataset" class="btn" id="submit-dataset" value="1">Datensatz anlegen</button>
                    </li>                                                           
                </ol>
            </form>
            <form class="suggestions">
                <legend>Vorschläge</legend>
                <ol>
                    <li>
                        <select name="suggestion-file" id="suggestion-file" class="suggestion-fields"></select>
                        <span class="add-suggestion file"></span>
                    </li>
                    <li>
                        <select name="suggestion-title" id="suggestion-title" class="suggestion-fields"></select>
                        <span class="add-suggestion title"></span>
                    </li>
                    <li>
                        <select name="suggestion-description" id="suggestion-description" class="suggestion-fields"></select>
                        <span class="add-suggestion description"></span>                       
                    </li>
                    <li>
                        <select name="suggestion-tags" id="suggestion-tag" class="suggestion-fields"></select>
                        <span class="add-suggestion tag"></span>
                    </li>
                    <li>
                        <select name="suggestion-license" id="suggestion-license" class="suggestion-fields"></select>
                        <span class="add-suggestion license"></span>
                    </li>
                   <li>
                        <select name="suggestion-organisation" id="suggestion-organisation" class="suggestion-fields"></select>
                        <span class="add-suggestion organisation"></span>
                   </li>
                   <li>
                        <select name="suggestion-visibility" id="suggestion-visibility" class="suggestion-fields"></select>
                        <span class="add-suggestion visibility"></span>
                   </li>
                   <li>
                        <select name="suggestion-version"  id="suggestion-version" class="suggestion-fields"></select>
                        <span class="add-suggestion version"></span>
                   </li>
                   <li>
                        <select name="suggestion-data-format"  id="suggestion-data-format" class="suggestion-fields"></select>
                        <span class="add-suggestion data-format"></span>
                   </li>
                   <li>
                        <select name="suggestion-file-size"  id="suggestion-file-size" class="suggestion-fields"></select>
                        <span class="add-suggestion file-size"></span>
                   </li>
                   <li>
                        <select name="suggestion-author"  id="suggestion-author" class="suggestion-fields"></select>
                        <span class="add-suggestion author"></span>
                   </li>
                   <li>
                        <select name="suggestion-email-author" id="suggestion-email-author" class="suggestion-fields"></select>
                        <span class="add-suggestion email-author"></span>
                   </li>
                   <li>
                        <select name="suggestion-maintainer" id="suggestion-maintainer" class="suggestion-fields"></select>
                        <span class="add-suggestion maintainer"></span>
                   </li>
                   <li>
                        <select name="suggestion-email-maintainer"  id="suggestion-email-maintainer" class="suggestion-fields"></select>
                        <span class="add-suggestion email-maintainer"></span>
                   </li>
                    <li>
                        <button type="submit" name="add-all-suggestions" class="btn" id="add-all-suggestions" value="1">Alle Vorschläge übernehmen</button>
                    </li>  
                </ol>
            </form>
        </div>
    </section>

    <footer>
        <div class="container">
            <div class="footer-links">
                <ul>
                    <li>
                        <a href="http://www.wu.ac.at/">Wirtschaftsuniversität Wien</a>
                    </li>
                    <li>  
                        <a href="http://data.wu.ac.at/">Open Data@WU</a>
                    </li>
                    <li>
                        <a href="#">Über dieses Projekt</a>
                    </li>
                </ul>
            </div>
            <div class="credit-wrapper">
                <div id="credits-ckan">
                    <strong>Powered by</strong>
                    <a href="http://ckan.org" target="_blank" id="footer-logo">CKAN</a>
                </div>
                <div id="credits-developer">
                    <strong>© 2016 Antunovi&#x0107; Franjo, WU Wien</strong>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>