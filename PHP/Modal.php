<?php
echo '<div class="modal">';
  /*INFORMATION*/
  echo '<div class="modal-container information">';
    echo '<div class="modal-body">';
      echo '<h2></h2>';
    echo '</div>';   
  echo '</div>';

 /*LOGIN*/
  echo '<div class="modal-container login">';
    echo '<form id="login-form">';
      echo '<div class="modal-header">';
        echo '<legend>Login</legend>';
        echo '<div class="close-container"></div>';
      echo '</div>';

      echo '<div class="modal-body">';
        echo '<ul>';
          echo '<li>';
            echo '<select name="portal" id="portal">';
              echo '<option value="data-wu">data.wu.ac.at</option>';
              echo '<option value="demo-ckan">demo.ckan.org</option>';
            echo '</select>';
          echo '</li>';
          echo '<li><input type="text" name="api-key" id="api-key" placeholder="API-Key" autofocus /></li>';
          echo '<li><a href="http://demo.ckan.org/user/login" class="modal-links" target="blank">API-Key anfordern</a></li>';
        echo '</ul>';
      echo '</div>';
      
      echo '<div class="modal-footer">';
        echo '<input type="submit" value="Einloggen" name="login" id="login" />';
      echo '</div>';
    echo '</form>';  
  echo '</div>';

echo '</div>';
?>