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
          
          "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/layers/GraphicsLayer",
               
          "dojo/domReady!"],
              
    function(Map,esriConfig,FeatureLayer,
             Query,Polygon,Graphic,SimpleFillSymbol,
             SimpleLineSymbol,Color,GraphicsLayer) {
        app.map = new Map("map", {
          basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
          center: [-104.595337, 38.255706], // longitude, latitude
          zoom: 11,
          sliderPosition: "top-right",
            maxZoom: 14,
            minZoom: 9
        });
          
     //     console.log(app.map);
        
        esriConfig.defaults.io.proxyUrl = "/sites/default/script/proxy.php";
        esriConfig.defaults.io.alwaysUseProxy = false;
          
          
      //  app.zipCodeLayer = new FeatureLayer('http://maps.co.pueblo.co.us/outside/rest/services/internal_map_services/pueblo_county_counties_zipcodes_municipalities/MapServer/2',{mode: FeatureLayer.MODE_SNAPSHOT});
       // app.municipalitiesLayer = new FeatureLayer('http://maps.co.pueblo.co.us/outside/rest/services/internal_map_services/pueblo_county_counties_zipcodes_municipalities/MapServer/0',{mode: FeatureLayer.MODE_SNAPSHOT});  
       // app.countyLayer = new FeatureLayer('http://maps.co.pueblo.co.us/outside/rest/services/internal_map_services/pueblo_county_counties_zipcodes_municipalities/MapServer/1',{mode: FeatureLayer.MODE_SNAPSHOT});  
        
          
       // app.map.addLayer(app.zipCodeLayer);
        
        app.Polygon = Polygon;
        app.Graphic = Graphic;
        app.SimpleFillSymbol = SimpleFillSymbol;
        app.SimpleLineSymbol = SimpleLineSymbol;
        app.Color = Color;
        app.query = new Query(); //declare query for later use in querying map layers
        app.FeatureLayer = FeatureLayer;
        app.drawingInfo = {};
        app.layers = {};
        app.gLayer = GraphicsLayer;
        app.graphicsLayer =  new app.gLayer();
        app.selectedPolygon = {};
        app.previouslySelectedPolygon = null;
      //  loadDrawingInfo();
          
        
        
      }); // End of map script


    
    var menu = "";

    $(document).ready(function() {
        loadLayers()
        loadFilters();
        loadLocationTaxonomy();
        $('.menu-link').bigSlide();
     
        
        
        $('.filter input').click(queryDocuments);
        $('.options input').click(queryDocuments);
        $('.menu-link').click(showResultsPanel);
        $(window).resize(fixAfterResize);
    });


    function loadLocationTaxonomy(){
        app.locationTaxonomy = {};
        $.get("/taxonomy-identifier").then(function(results){
        
//            console.log(results);
            $.each(results.nodes,function(index, value){
            
           //     console.log(value.node);
                app.locationTaxonomy[sanitizeString(value.node.name)] = value.node.id;
            });
          //  console.log(app.locationTaxonomy);
        });
    
    }


    function loadDrawingInfo(mapLayer){
    
        $.get(mapLayer.node.url + '?f=json').then(function(res){
            res = $.parseJSON(res);
         //   console.log(res);
            $.each(res.drawingInfo.renderer.uniqueValueInfos,function(index,value){
                if(app.drawingInfo[mapLayer.node.class] == undefined){
                    app.drawingInfo[mapLayer.node.class] = {};
                }
                var proper_label = sanitizeString(value.label);
                   
              //  console.log(proper_label);
                app.drawingInfo[mapLayer.node.class][proper_label] = value.symbol.color;
                
            });
        
            console.log(app);
        }); //end of drawingInfo JSON fetch
    
    }

    function loadLayers(){
        var termURL = "/map-layers"
        $.get(termURL).then(function(res){
            
           // console.log(res);
            $.each(res.nodes,function(index,value){
      //      console.log(value);
                    app.layers[value.node.class] = new app.FeatureLayer(value.node.url,{mode: app.FeatureLayer.MODE_SNAPSHOT});
                    app.layers[value.node.class].field_to_query = value.node.query_field;
 //               console.log(app.layers[value.node.class]);
                    var output =  '<li><label><input type="radio" name="layer" class="' + value.node.class + '" > ' + value.node.title + ' </label></li>';
                    $('.sub-menu.map-layers ul').append(output);
            
                
                
                loadDrawingInfo(value);
            });
            
            $('.map-layers input').click(layerToggle);
        });
    
    }


    function fixAfterResize(){
        
        showResultsPanel();
    
    }

    function clearGraphics(){
        $('path').fadeOut("slow",function(){
            app.map.graphics.clear();
        });
        
    
    }

    function showGraphics(){
         $('path').fadeIn("slow",function(){});
    }


    function queryDocuments(){
        hideResultsPanel(); //make sure results disappear when messing with filter options
        clearGraphics();

        var termURL = makeQueryURLForDocuments(false); 
        console.log(termURL);
       
  
        $.get(termURL).then(function(res){
 
          var queryString =  makeLayerQuery(res);
          console.log(queryString);
           
            app.query.where = queryString;
            app.query.geometry = app.map.extent;
            app.query.outFields = ["*"];
            var layer = $('.map-layers ul li input:checked').attr('class'); //identifies which layer to be queried
           // console.log(layer);
           // console.log(app.layers[layer]);
            app.layers[layer].selectFeatures(app.query, app.FeatureLayer.SELECTION_NEW, function(results){
                console.log(results);
                processGraphics(results, layer, app.layers[layer].field_to_query);
                showGraphics();
            });
            
            console.log(app.map);
        });
        
   
    }
    
    function sanitizeString(str){
         str = str.replace(/ /g,"_");
         str = str.toLowerCase();
         return str;
    }
    
    function unsanitizeString(str){
         str = str.replace("_","%20");
         str = str.toLowerCase();
         return str;
    }

    function processGraphics(results, layer, field){
      //  console.log(app);
      //  console.log(layer);
        
     //   console.log(field);
        $.each(results,function(index,value){
            var location = sanitizeString(value.attributes[field]);
           // value.attributes[field] = sanitizeString(value.attributes[field]);
            
          //  console.log(value.attributes[field]);
           // console.log(app.drawingInfo[value.attributes.ID]);
            var shadeFactor = .70; //change this to make darker or lighter
            var rgbOutline = [Math.round(app.drawingInfo[layer][location][0] * shadeFactor), Math.round(app.drawingInfo[layer][location][1] * shadeFactor),Math.round(app.drawingInfo[layer][location][2] * shadeFactor), 1];
            var rgbFill = [app.drawingInfo[layer][location][0],app.drawingInfo[layer][location][1],app.drawingInfo[layer][location][2], 0.70];

            var polygonSymbol = new app.SimpleFillSymbol(app.SimpleFillSymbol.STYLE_SOLID,
                new app.SimpleLineSymbol(app.SimpleLineSymbol.STYLE_SOLID,
                new app.Color(rgbOutline),4),new app.Color(rgbFill));


            var graphic = new app.Graphic(value.geometry, polygonSymbol);

            graphic.locationID = value.attributes[field]; //this lets us bypass querying the map service again for this attribute

            app.map.graphics.add(graphic);

            if(graphicAddedToMap == false){ //ensures click handler only fires once
                graphicAddedToMap = true;
                 app.map.graphics.on("click",function(evt){
//                   try{ app.graphicsLayer.clear();}catch(e){}
                    app.map.graphics.disableMouseEvents(); //prevents users from sending multiple ajax requests by double-clicking
                    getDocumentsForDisplay(evt);
//                    highlightPolygon(evt);
//                    app.map.addLayer(app.graphicsLayer);
                 }); 
                
            }
        });
        $('path').click(highlightPolygon);
    }

    function highlightPolygon(path){
        if(app.previouslySelectedPolygon == null){
            app.previouslySelectedPolygon = {};
            app.previouslySelectedPolygon.polygon = $(path.currentTarget);
            app.previouslySelectedPolygon.color = $(path.currentTarget).attr("fill");
        } else {
            app.previouslySelectedPolygon.polygon = app.selectedPolygon.polygon;
            app.previouslySelectedPolygon.color = app.selectedPolygon.color;
            
            $('path[fill="rgb(255,0,0)"]').attr("fill",app.selectedPolygon.color);
            
        }
        
        app.selectedPolygon.polygon = $(path.currentTarget);
        app.selectedPolygon.color = $(path.currentTarget).attr("fill");
        
//        console.log(app);
//        console.log($(path.currentTarget));
        app.previouslySelectedPolygon.polygon.attr("fill",app.previouslySelectedPolygon.color);
        console.log($('path[fill="' + $(path.currentTarget).attr("fill") + '"]'));
        $('path[fill="' + $(path.currentTarget).attr("fill") + '"]').attr("fill","rgb(255,0,0)");
       // $(path.currentTarget).attr("fill","rgb(255,0,0)");
        
       
    }



    function showResultsPanel(){
       var bodyWidth = $(window).width();
        
        var menuWidth = $("nav#menu").width();
        
      //  console.log( bodyWidth);
      //  console.log( menuWidth);
        if($('nav#menu').hasClass("open")){
            $(".push.wrap").css("width",(bodyWidth - menuWidth));
        
        } else {
            $(".push.wrap").css("width",bodyWidth );
        }
        // console.log($(".push.wrap").css("width"));
       
    }

    function hideResultsPanel(){
    // $(".results").hide();
     
     try{ 
        $(".results").accordion("destroy");
     }catch(e){}
     try{ $(".year-accordion-result-wrapper").accordion("destroy");
        }catch(e){}
     $(".results").empty();
    
    }

    function getDocumentsForDisplay(evt){
     //  console.log(evt);
        hideResultsPanel();
        var location = sanitizeString(evt.graphic.locationID);
        var termURL = makeQueryURLForDocuments(true,location);
        console.log(termURL);
        
        $.get(termURL).then(function(results){
          //  console.log(results);
            
             var year;
             var sortedResults = {};
             $.each(results.nodes,function(index,value){
                if(year == null || year == undefined || year != value.node.year){
                    year = value.node.year;
                    if(sortedResults[year] == undefined){
                        sortedResults[year] = {};
                    };
                    
                }
                sortedResults[year][index] = value;
             });
            
            
            
            
            
            
         if(Object.size(sortedResults) > 1){
            var yearOutput = "";
            var resultCount = 0;
            $.each(sortedResults,function(index,value){
                yearOutput += '<h3>' + index + '</h3>';
                yearOutput += '<div class="year-accordion-result-wrapper">';
                 
                var output = "";
            
                $.each(value,function(index2,value2){
                   console.log(index2);
                   console.log(value2);
                   resultCount++;
                  
              //  console.log(value);
                
                
                
                
                output += '<h5><span class="title">' + value2.node.title + '</span><span class="counter">' + (resultCount) + ' of ' + results.nodes.length;
                    
                if(results.nodes.length == 1){
                    output += ' Result</span></h5>';
                } else {
                    output += ' Results</span></h5>';
                }
                
                output += '<div class="accordion-result-wrapper">' //wrapper needed for accordion
                    + '<div class="description"><div class="content-title">Description:</div><div class="result-content">' + value2.node.description + '</div></div>'
                    + '<div class="post-date"><div class="content-title">Date Posted:</div><div class="result-content">' + value2.node.posted + '</div></div>'
                    + '<div class="links"><div class="content-title">Downloads:</div><div class="result-content"><ul>';
                
                $.each(value2.node.files.split(","),function(index3,value3){ //in case of multiple files
                   
                    var filetype = value3.substr( (value3.lastIndexOf('.') +1) );
                    filetype = filetype.toUpperCase();
                    output += '<li><div class="file-link"><a href="' + value3 + '" target="_blank">' + filetype + '</a></div></li>';
                    
                });
                
                output += '</ul></div></div>' //end links div
                       + '</div>'; //end of wrapper
                
          
                   
                   
               
               });
                yearOutput += output;
                yearOutput += '</div>'; //end of wrapper
            }); //end of multi year loop
            
            
            
            
           // console.log(yearOutput);
             $(".results").append(yearOutput);
             
            
             
             $(".year-accordion-result-wrapper").accordion({ header: "h5", collapsible: true, active: false, fillSpace:true, clearStyle:true });
              $(".results").accordion({ header: "h3", collapsible: true, active: false }).show();
             
        } else {     
            
            var output = "";
            
            $.each(results.nodes,function(index,value){
              //  console.log(value);
                
                
                
                
                output += '<h5><span class="title">' + value.node.title + '</span><span class="counter">' + (index + 1) + ' of ' + results.nodes.length;
                    
                if(results.nodes.length == 1){
                    output += ' Result</span></h5>';
                } else {
                    output += ' Results</span></h5>';
                }
                
                output += '<div class="accordion-result-wrapper">' //wrapper needed for accordion
                    + '<div class="description"><div class="content-title">Description:</div><div class="result-content">' + value.node.description + '</div></div>'
                    + '<div class="post-date"><div class="content-title">Date Posted:</div><div class="result-content">' + value.node.posted + '</div></div>'
                    + '<div class="links"><div class="content-title">Downloads:</div><div class="result-content"><ul>';
                
                $.each(value.node.files.split(","),function(index2,value2){ //in case of multiple files
                   
                    var filetype = value2.substr( (value2.lastIndexOf('.') +1) );
                    filetype = filetype.toUpperCase();
                    output += '<li><div class="file-link"><a href="' + value2 + '" target="_blank">' + filetype + '</a></div></li>';
                    
                });
                
                output += '</ul></div></div>' //end links div
                       + '</div>'; //end of wrapper
                
            });
            
            $(".results").append(output);
            $(".results").accordion({ header: "h5", collapsible: true, active: false }).show();
            
            
            
        }
           app.map.graphics.enableMouseEvents(); //turn mouse events back on
           
           showResultsPanel();
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
        
            
            
            
            
            
//            var urlx = "/json/";
//            
//            var lists = $('.filter ul').get();
//            
//            console.log(lists);
//            $.each(lists, function(index,value){
//                
//                
//                if($("input:checkbox:checked",value).length > 0){
//                    
//                    
//                    $.each($("input",value),function(index2,value2){
//                
//                        if($(value2)[0].checked){
//                            
//                            urlx += value2.className + "+";
//                        
//                        }
//                
//                    });
//                   urlx = urlx.substr(0,urlx.length - 1); //remove final + or ,
//                   urlx += "/";
//                }
//                
//                
//             
//            });
//            
//            
//            urlx = urlx.substr(0,urlx.length - 1); //remove final + or ,
//                console.log(urlx);
//            termURL = urlx;
//            
            
            
        } else {
//            console.log(app.locationTaxonomy[location]);
          //  location = app.locationTaxonomy[location]; //convert to term id
            
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
            termURL += "/" + unsanitizeString(location);

        
        }
        
        
        //console.log(termURL);
        return termURL;
    }



    function makeLayerQuery(json){
       // console.log(json);
        //app.layers[value.node.class].field_to_query
        var layer = $('.map-layers ul li input:checked').attr('class');
        
        var field = app.layers[layer].field_to_query;
        
        var query = field + " like '%asdrweasdfjkl%' ";
        $.each(json.nodes,function(index,value){
//            console.log(value.node);
            query += " or " + field + " = '" + value.node.location + "' ";
        });
//        console.log(query);
        return query;
    }







    function layerToggle(){
        clearGraphics();
        hideResultsPanel();

        
        
        var layers = $('.map-layers input:not(:checked)').get();
        
        $.each(layers, function(index,value){
        //    try{app.map.removeLayer(app.layers[value.className]);}catch(e){}
        });
        
        var layer = $('.map-layers ul li input:checked').attr('class'); //identifies which layer to be queried
       //  app.map.addLayer(app.layers[layer]);
        
        queryDocuments();
    }




    function loadFilters(){
  //  console.log(filterJSON);
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
        //$('#menu-options').accordion({ header: "h5", collapsible: true, active: true });
    }