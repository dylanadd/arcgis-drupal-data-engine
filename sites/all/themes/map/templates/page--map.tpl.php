<?php
/**
 * @file
 * Returns the HTML for a single Drupal page.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728148
 */
?>



  
  <div id="map"></div>


<nav id="menu" class="panel" role="navigation">
    <div class="menu-link-wrap">
        <a href="#menu" class="menu-link">&#9776;</a>
    </div>    
    <div id="menu-options">
    <h5>Select A Layer</h5>
        <div class="sub-menu map-layers">
            <ul>
                <li><label><input type="checkbox" class="zip-codes" checked="checked"> Zip Codes </label></li>
                <li><label><input type="checkbox" class="municipalities"> Municipalities </li>
                <li><label><input type="checkbox" class="countywide"> Countywide </li>
            </ul>
        </div>
    <h5>Filter Results</h5>
        
        <div  class="sub-menu filter">
            
        </div>
   
    </div>

</nav>

