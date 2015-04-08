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
                    <li><label><input type="checkbox" class="municipalities"> Municipalities </label></li>
                    <li><label><input type="checkbox" class="countywide"> Countywide </label></li>
                </ul>
            </div>
        <h5>Filter Results</h5>

            <div  class="sub-menu filter">

            </div>
        <h5>Filter Options</h5>
            <div class="sub-menu optionssub-menu options">
                <ul>
                    <li><label><input type="radio" name="option" class="match-all" checked="checked">Exact Matches Only</label></li>
                    <li><label><input type="radio" name="option" class="match-one">Partial Matches Allowed</li>
                </ul>
            </div>
    </div>
    

</nav>

<div class="push wrap">
    <div class="results">
<!--        This is the results panel.-->
    </div>

</div>
