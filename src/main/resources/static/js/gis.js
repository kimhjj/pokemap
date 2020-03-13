var MapInit = function(policy) {

    if (!(this instanceof MapInit)) {
        throw new Error("New 를 통해 생성 하십시오.");
    }

	// set value
	var centerPoint = [126.942803, 37.483040];
	var vworldTile = new ol.layer.Tile({
	    title : 'VWorld Map',
	    visible : true,
	    type : 'base',
	    source : new ol.source.XYZ({
	        url : 'http://xdworld.vworld.kr:8080/2d/Base/201512/{z}/{x}/{y}.png'
	    })
	});
	var gymLayer = new ol.layer.Image({
        id: 'gym_layer',
        visible: true,
        source: new ol.source.ImageWMS({
            url: 'http://localhost:8080/geoserver/pokemap/wms',
            params: {
                'VERSION' : '1.1.1',
                'SRS': 'EPSG:3857',
                'STYLES': 'pokestop',
                tiled: true,
                layers: ['pokestop_info'],
                //query_layers : wmsLayerKeys,
                CQL_FILTER: "code='GYM'"
            }
        })
    });

	var pokestopLayer = new ol.layer.Vector({
        id: 'pokestop_layer',
        visible: true,
        zIndex : 50,
        renderMode: 'vertor',
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: function(extent) {
                var queryString = "code='STOP'";
                var url = 'http://localhost:8080/geoserver/pokemap/wfs?service=WFS' +
                    '&version=1.1.0&request=GetFeature&typename=pokestop_info&outputFormat=application/json&srsname=EPSG:3857' +
                    '&CQL_FILTER='+queryString;
                return url;
            },
            strategy: ol.loadingstrategy.bbox
        }),
        style:  new ol.style.Style({
			image : new ol.style.Circle({
				radius : 8,
				fill : new ol.style.Fill({
					color : 'rgb(0, 0, 255)'
				}),
				stroke : new ol.style.Stroke({
					color : 'black',
					width : 1
				})
			})
		})
    });

	var source = new ol.source.Vector();
	var drawLayer = new ol.layer.Vector({
		id : 'draw_layer',
		visible : true,
		// zIndex : 50,
		source : source,
		style : new ol.style.Style({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 255, 0.2)'
			}),
			stroke : new ol.style.Stroke({
				color : '#ffcc33',
				width : 2
			}),
			image : new ol.style.Circle({
				radius : 7,
				fill : new ol.style.Fill({
					color : '#ffcc33'
				})
			})
		})
	});

	var selectedStyle = function(feature) {
		return style = new ol.style.Style({
			image : new ol.style.Circle({
				radius : 10,
				fill : new ol.style.Fill({
					color : 'rgb(97, 151, 255)'
				}),
				stroke : new ol.style.Stroke({
					color : 'white',
					width : 2
				})
			})
		});
	}

	var selectPokestop = new ol.interaction.Select({
		condition: ol.events.condition.click,
		layers: [pokestopLayer],
		style: selectedStyle,
		filter: function(feature) {
			if(!Pokemap.insertMode) {
				return feature;
			}
		}
	});

	var selectDraw = new ol.interaction.Select({
		condition: ol.events.condition.click,
		layers: [drawLayer],
		filter: function(feature) {
			if(Pokemap.insertMode) {
				return feature;
			}
		}
	});

	var select = new ol.interaction.Select();
	var translate = new ol.interaction.Translate({
	  features: select.getFeatures()
	});

	var draw = new ol.interaction.Draw({
		source: source,
		type: 'Point',
		condition: function(feature, b, c) {
			return true;
		}
	});
	Pokemap.draw = draw;

	selectPokestop.on('select', function(event) {
	      var features = event.selected;
	      for(var i in features) {
	    	  var feature = features[i];
	    	  var name = feature.getProperties().name;
	    	  debugger
	      }
	});

	draw.on('drawstart', function(event){
		drawLayer.getSource().clear();
	});
	draw.on('drawend', function(event){
		Pokemap.draw.setActive(false);
		debugger
	});

//
//	var addFeatures = selectDraw.getFeatures();
//	addFeatures.on('add', function(event) {
//	      debugger
//    });

    // set map
    var map = new ol.Map({
        controls: [
            new ol.control.Zoom(),
            new ol.control.FullScreen(),
            new ol.control.MousePosition({
                projection: 'EPSG:4326',
                coordinateFormat: ol.coordinate.createStringXY(2)
            }),
            new ol.control.ZoomToExtent({
                extent: [12878110, 3779046, 15395028, 5381166]
            }),
            new ol.control.ScaleLine()
        ],
        layers : [
            new ol.layer.Group({
                title: 'Base Maps',
                layers: [
                    vworldTile,
                    gymLayer
                ]
            }),
            new ol.layer.Group({
            	title: 'Vector',
            	layers: [
                    pokestopLayer,
            		drawLayer
            	]
            })
        ],
        renderer: 'canvas',
        interactions: ol.interaction.defaults({
            shiftDragZoom : true
        }).extend([selectPokestop, selectDraw, draw, select, translate]),	//new app.Drag(),
        view : new ol.View({
            projection: 'EPSG:3857',
            center: new ol.geom.Point(centerPoint).transform('EPSG:4326', 'EPSG:3857').getCoordinates(),
            zoom: 14,
            minZoom: 7,
            maxZoom: 19
        })
    });

   /*map.on('singleclick', function(event){
        if (event.dragging) return;

        var coord = event.coordinate;
        var transCoord = transformTo4326(coord);
        var feature = getFeatureByCoord('Point', transCoord);
        // column name
    	feature.setGeometryName('location');

    	if(!confirm('등록하시겠습니까?')) {
    		return false;
    	}

        transactWFS('insert', feature);
    });*/

    var formatWFS = new ol.format.WFS();
    var formatGML = new ol.format.GML({
    	featureNS: 'pokemap',
    	featureType: 'pokestop_info',
    	version: '1.1.0'
    });

    var transactWFS = function(action, feature) {
    	if(feature == null)
    		return;

    	var node;
    	switch (action) {
        case 'insert':
        	feature.set('code', 'STOP');
        	feature.set('name', 'Insert Test test test');
        	node = formatWFS.writeTransaction([feature], null, null, formatGML);
        	break;

        case 'update':
        	feature.set('code', 'STOP');
        	feature.set('name', 'Update Update Update Update');
        	node = formatWFS.writeTransaction(null, [feature], null, formatGML);
        	break;

        	case 'delete':
        	node = formatWFS.writeTransaction(null, null, [feature], formatGML);
        	break;
    	}

    	$.ajax({
    	    service: 'WFS',
    	    type: "POST",
    	    url: "http://localhost:8080/geoserver/pokemap/wfs",
    	    dataType: 'xml',
    	    processData: false,
    	    contentType: 'text/xml',
    	    data: new XMLSerializer().serializeToString(node),
    	    contentType: 'text/xml',
    	    success: function(data) {
    	    	debugger
    	    	console.log(formatWFS.readTransactionResponse(data));
    	    },
    	    error: function(e) {
    	    	console.error(e);
    	    },
    	    context: this
//    	}).done(function() {
//    	    vectorSource.clear();
//    	    map.removeInteraction(draw);
//    	    map.removeInteraction(select);
//    	    select.getFeatures().clear();
    	});
    };

    /**
     * 파라미터로 받은 좌표로 Feature를 생성하여 리턴한다.
     * @param   {string} geomType (Point, Polygon)
     * @param   {Array<string>} coord
     * @returns {Object} ol.Feature
     */
    var getFeatureByCoord = function(geomType, coord) {
        // validation

        var shape = {
            'Point': new ol.geom.Point(coord),
            'LineString': new ol.geom.LineString(coord),
            'Polygon': new ol.geom.Polygon([coord])
        }

        var feature = new ol.Feature({
            geometry: shape[geomType],
            location: shape[geomType]	// for wfs-t
        });

        return feature;
    }


    var transformTo4326 = function(coord) {
        var transCoord = [];
        if(coord) {
            transCoord = ol.proj.transform(coord, "EPSG:3857", "EPSG:4326");
        }
        return transCoord;
    }

    /*
    draw.on('drawend', function(evt) {
        var feature = evt.feature;
        feature.set('geometry', feature.getGeometry());
        var fid = feature.getId();
        var node = format.writeTransaction([feature], null, null, {
            gmlOptions: {srsName: "EPSG:3857"},
            featureNS: "fiware",
            featureType: "nyc_buildings"
    });
    */

    return {
    	create: function(element) {
    		map.setTarget(element);
    		return map;
    	},
    	add: function() {
    		var feature = drawLayer.getSource().getFeatures()[0];
    		if(feature) {
            	var coord = feature.getGeometry().getCoordinates();
    	        var transCoord = transformTo4326(coord);
    			var newFeature = getFeatureByCoord('Point', transCoord);
    			newFeature.setGeometryName('location');
    			draw.setActive(false);
    			transactWFS('insert', newFeature);
    		} else {
    			alert('지점을 선택해주세요.');
    		}
    	}
    }
}

//var getCurProj: function() {
//    return map.getView().getProjection();
//},


