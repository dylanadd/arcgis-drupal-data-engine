        Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

      var app = {};

      var graphicAddedToMap = false; //needed to set graphic click handler


      require([
          "esri/map", "esri/config", "esri/layers/FeatureLayer",
               
          "esri/tasks/query", "esri/geometry/Polygon", "esri/graphic", "esri/symbols/SimpleFillSymbol",
          
          "esri/symbols/SimpleLineSymbol", "esri/Color",
               
          "dojo/domReady!"],
              
    function(Map,esriConfig,FeatureLayer,
             Query,Polygon,Graphic,SimpleFillSymbol,
             SimpleLineSymbol,Color) {
        app.map = new Map("map", {
          basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
          center: [-104.595337, 38.255706], // longitude, latitude
          zoom: 13,
          sliderPosition: "top-right"
        });
          
          console.log(app.map);
        
        esriConfig.defaults.io.proxyUrl = "/sites/default/script/proxy.php";
        esriConfig.defaults.io.alwaysUseProxy = false;
          
          
        app.zipCodeLayer = new FeatureLayer('http://maps.co.pueblo.co.us/outside/rest/services/internal_map_services/pueblo_county_counties_zipcodes_municipalities/MapServer/2',{mode: FeatureLayer.MODE_SNAPSHOT});
        app.municipalitiesLayer = new FeatureLayer('http://maps.co.pueblo.co.us/outside/rest/services/internal_map_services/pueblo_county_counties_zipcodes_municipalities/MapServer/0',{mode: FeatureLayer.MODE_SNAPSHOT});  
        app.countyLayer = new FeatureLayer('http://maps.co.pueblo.co.us/outside/rest/services/internal_map_services/pueblo_county_counties_zipcodes_municipalities/MapServer/1',{mode: FeatureLayer.MODE_SNAPSHOT});  
        
          
        app.map.addLayer(app.zipCodeLayer);
        app.Polygon = Polygon;
        app.Graphic = Graphic;
        app.SimpleFillSymbol = SimpleFillSymbol;
        app.SimpleLineSymbol = SimpleLineSymbol;
        app.Color = Color;
        app.query = new Query(); //declare query for later use in querying map layers
        app.FeatureLayer = FeatureLayer;
        app.drawingInfo = {};
        $.get('http://maps.co.pueblo.co.us/outside/rest/services/internal_map_services/pueblo_county_counties_zipcodes_municipalities/MapServer/2?f=json').then(function(res){
            res = $.parseJSON(res);
            $.each(res.drawingInfo.renderer.uniqueValueInfos,function(index,value){
                
                
                app.drawingInfo[value.label] = value.symbol.color;
                
            });
        
            
        }); //end of drawingInfo JSON fetch
          
        
        
      }); // End of map script


    
    var menu = "";

    $(document).ready(function() {
        
        loadFilters();
        
        $('.menu-link').bigSlide();
     
        $('.map-layers input').click(layerToggle);
        
        $('.filter input').click(queryDocuments);
        $('.options input').click(queryDocuments);
        

    });






    function queryDocuments(){
        app.map.graphics.clear();

        var termURL = makeQueryURLForDocuments(false); 
        console.log(termURL);
       
  
        $.get(termURL).then(function(res){
 
          var queryString =  makeLayerQuery(res);
          console.log(queryString);
           
            app.query.where = queryString;
            
            app.zipCodeLayer.selectFeatures(app.query, app.FeatureLayer.SELECTION_NEW, function(results){
                
                
                $.each(results,function(index,value){
                   // console.log(app.drawingInfo[value.attributes.ID]);
                    var shadeFactor = .70; //change this to make darker or lighter
                    var rgbOutline = [Math.round(app.drawingInfo[value.attributes.ID][0] * shadeFactor), Math.round(app.drawingInfo[value.attributes.ID][1] * shadeFactor),Math.round(app.drawingInfo[value.attributes.ID][2] * shadeFactor), 1];
                    var rgbFill = [app.drawingInfo[value.attributes.ID][0],app.drawingInfo[value.attributes.ID][1],app.drawingInfo[value.attributes.ID][2], 0.70];
                    
                    var polygonSymbol = new app.SimpleFillSymbol(app.SimpleFillSymbol.STYLE_SOLID,
                        new app.SimpleLineSymbol(app.SimpleLineSymbol.STYLE_SOLID,
                        new app.Color(rgbOutline),4),new app.Color(rgbFill));
                    
                    
                    var graphic = new app.Graphic(value.geometry, polygonSymbol);
                    
                    graphic.locationID = value.attributes.ID; //this lets us bypass querying the map service again for this attribute
                    
                    app.map.graphics.add(graphic);
                    
                    if(graphicAddedToMap == false){ //ensures click handler only fires once
                        graphicAddedToMap = true;
                         app.map.graphics.on("click",function(evt){
                            console.log(evt);
                            getDocumentsForDisplay(evt);
                             
                             
                         }); 
                    }
                });
                console.log(app.map.graphics.graphics.length);
            });
            
//            console.log(app.map);
        });
        
   
    }


    function getDocumentsForDisplay(evt){
      //  console.log(evt);
        var termURL = makeQueryURLForDocuments(true,evt.graphic.locationID);
        console.log(termURL);
        
        $.get(termURL).then(function(results){
            console.log(results);
        });
        
    }




    function makeQueryURLForDocuments(isLocation,location){
          var inputs = $('.filter input').get();
        var termURL = "/";
        if(!isLocation){
            termURL += "json/";
            $.each(inputs, function(index,value){

                if(value.checked){
                    console.log($('.match-all')[0].checked);
                    if($('.match-all')[0].checked){
                        termURL +=  value.className + ',' ;
                    } else {
                        termURL +=  value.className + '+' ;
                    }


                }

            });
            termURL = termURL.substr(0,termURL.length - 1); //remove final + or ,
        
        } else {
            termURL += "document/";
            $.each(inputs, function(index,value){

                if(value.checked){
                    console.log($('.match-all')[0].checked);
                    if($('.match-all')[0].checked){
                        termURL +=  value.className + ',' ;
                    } else {
                        termURL +=  value.className + '+' ;
                    }


                }

            });
            termURL = termURL.substr(0,termURL.length - 1); //remove final + or ,
            termURL += "/" + location;
        
        
        
        
        }
        
        
        //console.log(termURL);
        return termURL;
    }



    function makeLayerQuery(json){
       // console.log(json);
        var query = "ID like '%asdrweasdfjkl%' ";
        $.each(json.nodes,function(index,value){
//            console.log(value.node);
            query += " or ID like '%" + value.node.location + "%' ";
        });
//        console.log(query);
        return query;
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
                              menu += ' <li><label><input type="checkbox" class="' + value3.tid + '">' + value3.name + ' </label></li>';
                            });

                            menu += '</ul>';
                        
                     } else {
                         
                           
                            menuNoChildren += ' <li><label><input type="checkbox" class="' + value2.parenttid + '">' + value2.parentname + ' </label></li>';


                     
                     
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