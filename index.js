const API_KEY = "AIzaSyA7hJYNoWzHUUiFii5XCHFOIgeFfWAlZco";
var map;
var Neighborhood_Names_GIS ="https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
var NY_Districts_geoshapes ="https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const NY_Crimes = "https://data.cityofnewyork.us/resource/9s4h-37hy.json";

var vecindarios=new Array(0);
vecindarios[0]= ["Brooklyn",[]];//[ barrio,  punto]
vecindarios[1]= ["Bronx",[]];
vecindarios[2]= ["Queens",[]];
vecindarios[3]= ["Manhattan",[]];
vecindarios[4]= ["Staten Island",[]];




function initMap() {
  var myLatLng = {lat: 40.729266, lng: -73.996609};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: myLatLng
  });

    var icon = {
        url: "https://cdn3.iconfinder.com/data/icons/pix-glyph-set/50/520709-map_marker_1-512.png", // url
        scaledSize: new google.maps.Size(50, 50), // scaled size
        //origin: new google.maps.Point(0,0), // origin
        //anchor: new google.maps.Point(0, 0) // anchor
    };

  var marker = new google.maps.Marker({
    position: myLatLng,
     //label: "NYU",
    map: map,
    icon: icon,
    title: 'NYU Stern School of Business, New York'
  });
//geojason
    map.data.loadGeoJson(
          'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson');
          //esta funcion itera sola
          var color ;//= "#FF0000";
    map.data.setStyle(function(feature) {

                 var ID = feature.getProperty('BoroCD');
                 //console.log(ID);
                 if(ID>500){
                     //staten island
                     color= "#00FFFF";
                 } else if(ID>400){
                     //queens
                     color= "#FFFF00";
                 } else if(ID>300){
                     //broocklyn
                     color= "#0000FF";
                 } else if(ID>200){
                     //bronx
                     color= "#00FF00";
                 } else {
                     //manhatan
                     color= "#FF00FF";
                 }
             return {
               fillColor: color,
               strokeWeight: 1
             }

         })


}


//----------------------------------------------------------------------

function getLocation() {
    var info = $.ajax({
        url: NY_Districts_geoshapes,
        info:{
          //"$limit":500,
        },
      })
      .done(function (info) {
          
          var coor = new Array(71);
          var polf = new Array(71);
          var icon = {
                url: "http://www.clker.com/cliparts/N/g/p/e/K/Q/red-pin-no-shadow.svg", // url
                scaledSize: new google.maps.Size(25, 25), // scaled size
            };
            var polP= JSON.parse(info).features;
          for (var i = 0; i < polP.length; i++) {
              var pol = polP[i];
              coor[i]=[];
            if (pol.geometry.type =="MultiPolygon") {
              for (var j = 0; j <pol.geometry.coordinates.length; j++) {
                    for (var k = 0; k <pol.geometry.coordinates[j][0].length; k++) {
                      coor[i].push(
                        {lat: pol.geometry.coordinates[j][0][k][1],
                        lng:  pol.geometry.coordinates[j][0][k][0]
                        }
                      )
                    }
              }
            }else {
              for ( j = 0; j <pol.geometry.coordinates[0].length; j++) {
                coor[i].push(
                  {lat: pol.geometry.coordinates[0][j][1],
                  lng:  pol.geometry.coordinates[0][j][0]
                    }
                  )
                }
              }
            }
            // turn all coordinates into polygons
            for ( i = 0; i < coor.length; i++) {
              polf[i]= new google.maps.Polygon({paths: coor[i]});
            }
            var comp = vecindarios;
            var distric = new Array(0);
            /*the lat lng is not the same here comparing it to curPositionB
            console.log(comp[0][1][0]);
            console.log(comp[0][1][0][1]);
            console.log(comp[0][1][0][1].lat);
            */
            for (i = 0; i < polf.length; i++) {
              distric[i]=[];
              for (var o = 0; o < comp.length;o++) {
                for ( j = 0; j < comp[o][1].length; j++) {
                  var curPositionB = new google.maps.LatLng(comp[o][1][j][1].lat, comp[o][1][j][1].lng);
                  //console.log(curPositionB.lat);
                  if (google.maps.geometry.poly.containsLocation(curPositionB, polf[i])) {
                      distric[i].push(curPositionB);
                  } else {
                  }
                }
              }
            }
            for ( i = 0; i < distric.length; i++) {
              if (distric[i].length===undefined) {
                delete distric[i];
                i--;
              }
            }
            //console.log(distric);
      })
      .fail(function () {
        console.log(error);
      })
  var data = $.get(Neighborhood_Names_GIS, function(){})
  .done(function () {
    for (var i = 0; data.responseJSON.data[i] !== undefined; i++) {
      var mientras = data.responseJSON.data[i][9];
      var key= data.responseJSON.data[i][16];
      if (key=="Brooklyn") {
        vecindarios[0][1].push(
            [data.responseJSON.data[i][10],
              {lat: parseFloat(mientras.slice( mientras.lastIndexOf(" "), mientras.lastIndexOf(")")-1 )),
              lng:  parseFloat(mientras.slice(7, mientras.lastIndexOf(" ")))
            }

            ]
        );
      } else if (key=="Bronx") {
        vecindarios[1][1].push(
            [data.responseJSON.data[i][10],
              {lat: parseFloat(mientras.slice( mientras.lastIndexOf(" "), mientras.lastIndexOf(")")-1 )),
              lng:  parseFloat(mientras.slice(7, mientras.lastIndexOf(" ")))
            }

            ]
        );
      } else if (key=="Queens") {
        vecindarios[2][1].push(
            [data.responseJSON.data[i][10],
              {lat: parseFloat(mientras.slice( mientras.lastIndexOf(" "), mientras.lastIndexOf(")")-1 )),
              lng:  parseFloat(mientras.slice(7, mientras.lastIndexOf(" ")))
            }

            ]
        );
      } else if (key=="Manhattan") {
        vecindarios[3][1].push(
            [data.responseJSON.data[i][10],
              {lat: parseFloat(mientras.slice( mientras.lastIndexOf(" "), mientras.lastIndexOf(")")-1 )),
              lng:  parseFloat(mientras.slice(7, mientras.lastIndexOf(" ")))
            }

            ]
        );
      }else{
        vecindarios[4][1].push(
            [data.responseJSON.data[i][10],
              {lat: parseFloat(mientras.slice( mientras.lastIndexOf(" "), mientras.lastIndexOf(")")-1 )),
              lng:  parseFloat(mientras.slice(7, mientras.lastIndexOf(" ")))
            }

            ]
        );
      }

    }

    })
  .fail(function () {
    console.log(error);
  })

}
function getDistance() {
  //sin y cos tienen que estar en radianes
    //radio ecuatorial de la tierra
    const R = 6378;//en kilometros
   //revisar porque el resultado de las distancias
    var infoRows = [];
    for (var i = 0; i < vecindarios.length; i++) {
      for (var j = 0; j < vecindarios[i][1].length; j++) {
          var lat = (vecindarios[i][1][j][1].lat - 40.729266)*(Math.PI / 180);
          var lng = (vecindarios[i][1][j][1].lng+73.996609)*(Math.PI / 180);
          var a =( Math.pow(Math.sin(lat/2),2) + (Math.cos(40.729266*(Math.PI / 180))*Math.cos(vecindarios[i][1][j][1].lat*(Math.PI / 180))*Math.pow(Math.sin(lng/2),2))  );
          var c = 2 * Math.asin(Math.sqrt(a));
          infoRows.push(R*c);
        }
    }

      var tableReference = $("#mainTableBody2")[0];
      var newrow,district,distance,neighberhood;
      for (var l = 0; l < vecindarios.length; l++) {
          //newrow = tableReference.insertRow(tableReference.rows.length);

        for (var k = 0; k < vecindarios[l][1].length; k++) {
          newrow = tableReference.insertRow(tableReference.rows.length);
          district = newrow.insertCell();
          if (k===0) {

            district.innerHTML = vecindarios[l][0];
          }
          neighberhood = newrow.insertCell();
          distance = newrow.insertCell();

          neighberhood.innerHTML = vecindarios[l][1][k][0];
          distance.innerHTML = infoRows[l+k];
        }
      }
        console.log(infoRows.length);
}

function updateMap() {
    var icon = {
        url: "http://www.clker.com/cliparts/N/g/p/e/K/Q/red-pin-no-shadow.svg", // url
        scaledSize: new google.maps.Size(25, 25), // scaled size
    };
    for (var i = 0; i < vecindarios.length; i++) {
      for (var j = 0; j < vecindarios[i][1].length; j++) {
        var myLatLng = vecindarios[i][1][j][1];
        console.log(vecindarios[i][1][j][1]);
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon:icon,
          title: vecindarios[i][1][j][0]
        });
      }
    }
}
//Crimes
//solo trae los arreglos
function getDataCrimes() {
    var info = $.ajax({
    url: NY_Crimes,
    info:{
      "$limit":500,
    }
  })
  .done(function (info) {
    console.log(info);
  })
}


$("document").ready(function () {

  $("#updateDataButton").on("click",getDataCrimes)
  $("#updateLocationButton").on("click",getLocation)
  $("#updateDistanceButton").on("click",getDistance)
  $("#drawMarker").on("click",function () {
    updateMap();
  })
})
