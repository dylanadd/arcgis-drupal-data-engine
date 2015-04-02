        Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

      var app = {};

      require([
          "esri/map", "esri/config", "esri/layers/FeatureLayer",
               
               
               
          "dojo/domReady!"],
              
    function(Map,esriConfig,FeatureLayer) {
        app.map = new Map("map", {
          basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
          center: [-104.595337, 38.255706], // longitude, latitude
          zoom: 13,
          sliderPosition: "top-right"
        });
      
        esriConfig.defaults.io.proxyUrl = "/sites/default/script/proxy.php";
        esriConfig.defaults.io.alwaysUseProxy = false;
          
          
        app.zipCodeLayer = new FeatureLayer('http://maps.co.pueblo.co.us/outside/rest/services/internal_map_services/pueblo_county_counties_zipcodes_municipalities/MapServer/2',{mode: FeatureLayer.MODE_SNAPSHOT});
        app.municipalitiesLayer = new FeatureLayer('http://maps.co.pueblo.co.us/outside/rest/services/internal_map_services/pueblo_county_counties_zipcodes_municipalities/MapServer/0',{mode: FeatureLayer.MODE_SNAPSHOT});  
        app.countyLayer = new FeatureLayer('http://maps.co.pueblo.co.us/outside/rest/services/internal_map_services/pueblo_county_counties_zipcodes_municipalities/MapServer/1',{mode: FeatureLayer.MODE_SNAPSHOT});  
        
          
        app.map.addLayer(app.zipCodeLayer);
      }); // End of map script



    var menu = "";

    $(document).ready(function() {
        
        loadFilters();
        
        $('.menu-link').bigSlide();
     
        $('.map-layers input').click(layerToggle);
        
        $('.filter input').click(queryDocuments);
    });






    function queryDocuments(){
        
        var inputs = $('.filter input').get();
        var termURL = "/json";
        $.each(inputs, function(index,value){
            
            if(value.checked){
            
                termURL += '/' + value.className;
            
            }
            
            
         
        
        });
        var data;
         $.ajax({
             url: termURL,
             async: true,
             dataType: "json"
            }).done(function(res){
              
                console.log(res);
                data = $.parseJSON(res);
             console.log(data);
            });
        
       // this.set(data);
    }






    function layerToggle(){
        
        try{app.map.removeLayer(app.zipCodeLayer);}catch(e){}
        try{app.map.removeLayer(app.municipalitiesLayer);}catch(e){}
        try{app.map.removeLayer(app.countyLayer);}catch(e){}
        
     
        var layers = $('.map-layers input').get();
        
        $.each(layers, function(index,value){
               if(value.checked){
                    switch(value.className){
                        case 'zip-codes':
                            app.map.addLayer(app.zipCodeLayer);
                            break;
                        case 'municipalities':
                            app.map.addLayer(app.municipalitiesLayer);
                            break;
                        case 'countywide':
                            app.map.addLayer(app.countyLayer);
                            break;                

                    }
               }
        });
    }




    function loadFilters(){
    console.log(filterJSON);
        $.each(filterJSON, function(index, value){
             if(value.name != "Location"){
                  
                 var hasChildren = false;
                 var menuNoChildren = "";
                 $.each(value.taxonomy_tree,function(index2,value2){
                       
                  
                        
                     if(Object.size(value2.children) > 0){
                            hasChildren = true;
                            menu += '<div class="category">By ' + value2.parentname + '</div><ul>';

                            $.each(value2.children,function(index3,value3){
                              menu += ' <li><label><input type="checkbox" class="' + value3.name + '">' + value3.name + ' </label></li>';
                            });

                            menu += '</ul>';
                        
                     } else {
                         
                           
                            menuNoChildren += ' <li><label><input type="checkbox" class="' + value2.parentname + '">' + value2.parentname + ' </label></li>';


                     
                     
                     }
                    
                     
                     
                    });
                 
                 if(menuNoChildren != ""){
                        menu += '<div class="category">By ' + value.name + '</div><ul>';
                        menu += menuNoChildren;
                        menu += '</ul>';
                     }
                   
                            
                            
                        
                            
              }
        });
        
        
        $('div.sub-menu.filter').append(menu);
    
    }