
      var map;

      require(["esri/map", "dojo/domReady!"], function(Map) {
        map = new Map("map", {
          basemap: "topo",  //For full list of pre-defined basemaps, navigate to http://arcg.is/1JVo6Wd
          center: [-122.45, 37.75], // longitude, latitude
          zoom: 13
        });
      });

