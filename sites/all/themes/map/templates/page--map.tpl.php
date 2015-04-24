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
<!--
                    <li><label><input type="radio" name="layer" class="zipCodeLayer" checked="checked"> Zip Codes </label></li>
                    <li><label><input type="radio" name="layer" class="municipalities"> Municipalities </label></li>
                    <li><label><input type="radio" name="layer" class="countywide"> Countywide </label></li>
-->
                </ul>
            </div>
        <h5>Filter Results</h5>

            <div  class="sub-menu filter">

            </div>
        <h5>Action Panel</h5>
            <div class="sub-menu optionssub-menu options">
               <div class="search-database"><input type="button" value="Search"></div>
            </div>
            <div class="sub-menu optionssub-menu options">
               <div class="reset"><input type="button" value="Clear Results"></div>
            </div>
            <div class="sub-menu optionssub-menu options">
               <div class="help"><input type="button" value="Help"></div>
            </div>
    </div>
    

</nav>

<div class="push wrap right">
    <div class="results">
<!--        This is the results panel.-->
    </div>

</div>
