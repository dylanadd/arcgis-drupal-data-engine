
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
        
          
        app.map.addLayer(app.countyLayer);
      }); // End of map script





    $(document).ready(function() {
        $('.menu-link').bigSlide();
     
        $('.map-layers input').click(layerToggle);
    });

    function layerToggle(){
        
        try{app.map.removeLayer(app.zipCodeLayer);}catch(e){}
        try{app.map.removeLayer(app.municipalitiesLayer);}catch(e){}
        try{app.map.removeLayer(app.countyLayer);}catch(e){}
        
         console.log($('.map-layers input').get());
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