<?php
/**
 * @file
 * Contains the theme's functions to manipulate Drupal's default markup.
 *
 * Complete documentation for this file is available online.
 * @see https://drupal.org/node/1728096
 */


/**
 * Override or insert variables into the maintenance page template.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("maintenance_page" in this case.)
 */
/* -- Delete this line if you want to use this function
function map_preprocess_maintenance_page(&$variables, $hook) {
  // When a variable is manipulated or added in preprocess_html or
  // preprocess_page, that same work is probably needed for the maintenance page
  // as well, so we can just re-use those functions to do that work here.
  map_preprocess_html($variables, $hook);
  map_preprocess_page($variables, $hook);
}
// */

/**
 * Override or insert variables into the html templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("html" in this case.)
 */


function map_preprocess_html(&$variables, $hook) {
 // $variables['sample_variable'] = t('Lorem ipsum.');

    $node = menu_get_object();

  if ($node && $node->nid) {
    $variables['theme_hook_suggestions'][] = 'html__' . $node->type;
  }
    
 
    
  // The body tag's classes are controlled by the $classes_array variable. To
  // remove a class from $classes_array, use array_diff().
  //$variables['classes_array'] = array_diff($variables['classes_array'], array('class-to-remove'));
}
// */

/**
 * Override or insert variables into the page templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("page" in this case.)
 */

function map_preprocess_page(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');
    
    $node = menu_get_object();

  if ($node && $node->nid) {
    $variables['theme_hook_suggestions'][] = 'page__' . $node->type;
  }
  

    
   if($node && $node->type == "map"){
       $json = _get_taxonomy_json();
       drupal_add_js('jQuery(document).ready(function () { filterJSON = ' . $json . ';});', 'inline');
       
       drupal_add_js(drupal_get_path('theme', 'map') . '/js/jquery-1.11.2.min.js', array('group' => JS_THEME));   
       drupal_add_js(drupal_get_path('theme', 'map') . '/js/jquery-ui.min.js', array('group' => JS_THEME));
         
       
       drupal_add_js(drupal_get_path('theme', 'map') . '/js/bigSlide.js', array('group' => JS_THEME));  
       drupal_add_js('http://js.arcgis.com/3.13/', array('group' => JS_THEME));   
       drupal_add_js(drupal_get_path('theme', 'map') . '/js/map.js', array('group' => JS_THEME));  
       
       
       
       drupal_add_css(drupal_get_path('theme', 'map') . '/css/esri.css');  
       drupal_add_css(drupal_get_path('theme', 'map') . '/css/jquery-ui.min.css'); 
       drupal_add_css(drupal_get_path('theme', 'map') . '/css/map.css');  
    }    
 
}

function _get_taxonomy_json(){
    $variables['taxonomy_vocab'] = taxonomy_get_vocabularies();
    
    
    
    
    foreach($variables['taxonomy_vocab'] as $value){
     //kpr($value);
     $variables['taxonomy_vids'][] = ['vid'=>$value->vid,'name'=>$value->name];
    }
    
   // kpr($variables['taxonomy_vids']);
    
    
    foreach($variables['taxonomy_vids'] as $key => $value){
       // kpr($key);
        //kpr($value);
        
        $variables['taxonomy_vids'][$key]['taxonomy'] = taxonomy_get_tree($value['vid']);
       
        
    }
    
    // kpr($variables['taxonomy_vids']);
    
    
    foreach($variables['taxonomy_vids'] as $key => $value){
        
        foreach($variables['taxonomy_vids'][$key]['taxonomy'] as $key2 => $value2){
           // kpr($value2);
            
            if($value2->depth == 0){
                $variables['taxonomy_vids'][$key]['taxonomy_tree'][$value2->name]->parentname = $value2->name;
                $variables['taxonomy_vids'][$key]['taxonomy_tree'][$value2->name]->children = taxonomy_get_children($value2->tid);
                        
                
            } 

            
        }
    
    }
   // kpr($variables['taxonomy_vids']);
   // kpr(json_encode($variables['taxonomy_vids']));
    $json = json_encode($variables['taxonomy_vids']);
    
    return $json;
}


// */

/**
 * Override or insert variables into the node templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("node" in this case.)
 */
/* -- Delete this line if you want to use this function
function map_preprocess_node(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');

  // Optionally, run node-type-specific preprocess functions, like
  // map_preprocess_node_page() or map_preprocess_node_story().
  $function = __FUNCTION__ . '_' . $variables['node']->type;
  if (function_exists($function)) {
    $function($variables, $hook);
  }
}
// */

/**
 * Override or insert variables into the comment templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("comment" in this case.)
 */
/* -- Delete this line if you want to use this function
function map_preprocess_comment(&$variables, $hook) {
  $variables['sample_variable'] = t('Lorem ipsum.');
}
// */

/**
 * Override or insert variables into the region templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("region" in this case.)
 */
/* -- Delete this line if you want to use this function
function map_preprocess_region(&$variables, $hook) {
  // Don't use Zen's region--sidebar.tpl.php template for sidebars.
  //if (strpos($variables['region'], 'sidebar_') === 0) {
  //  $variables['theme_hook_suggestions'] = array_diff($variables['theme_hook_suggestions'], array('region__sidebar'));
  //}
}
// */

/**
 * Override or insert variables into the block templates.
 *
 * @param $variables
 *   An array of variables to pass to the theme template.
 * @param $hook
 *   The name of the template being rendered ("block" in this case.)
 */
/* -- Delete this line if you want to use this function
function map_preprocess_block(&$variables, $hook) {
  // Add a count to all the blocks in the region.
  // $variables['classes_array'][] = 'count-' . $variables['block_id'];

  // By default, Zen will use the block--no-wrapper.tpl.php for the main
  // content. This optional bit of code undoes that:
  //if ($variables['block_html_id'] == 'block-system-main') {
  //  $variables['theme_hook_suggestions'] = array_diff($variables['theme_hook_suggestions'], array('block__no_wrapper'));
  //}
}
// */
