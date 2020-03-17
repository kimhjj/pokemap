var MapInit = function(policy) {

    if (!(this instanceof MapInit)) {
        throw new Error("New 를 통해 생성 하십시오.");
    }

	// set value
	var geoserverUrl = 'http://localhost:8080/geoserver';
	var geoserverWorkspace = 'pokemap';
	var callGeoserverUrl = geoserverUrl + '/' + geoserverWorkspace;
	var projection = 'EPSG:3857';
	var dataProjection = 'EPSG:4326';
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
            url: callGeoserverUrl + '/wms',
            params: {
                'VERSION' : '1.1.1',
                'SRS': projection,
                'STYLES': 'pokestop',
                tiled: true,
                layers: ['pokestop_info'],
                //query_layers : wmsLayerKeys,
                CQL_FILTER: "code='GYM'"
            }
        })
    });

	var style = {
		normal: {
			Y: 'rgb(0, 0, 255)',
			N: 'rgb(169, 169, 169)'
		},
		selected: {
			Y: 'rgb(97, 151, 255)',
			N: 'rgb(112, 128, 144)'
		}
	}

	var pokestopLayer = new ol.layer.Vector({
        id: 'pokestop_layer',
        visible: true,
        zIndex : 50,
        renderMode: 'vertor',
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: function(extent) {
            	var layerName = 'pokestop_info';
                var queryString = "code='STOP'";
                var url = callGeoserverUrl + '/wfs?service=WFS&version=1.1.0&request=GetFeature' +
                    '&outputFormat=application/json&typename=' + layerName + '&srsname=' + projection +
                    '&CQL_FILTER='+queryString;
                return url;
            },
            strategy: ol.loadingstrategy.bbox
        }),
        style: function(feature) {
        	var researchYn = feature.getProperties().research_yn;
        	var color = style.normal[researchYn];
        	return new ol.style.Style({
    			image : new ol.style.Circle({
    				radius : 8,
    				fill : new ol.style.Fill({
    					color : color
    				}),
    				stroke : new ol.style.Stroke({
    					color : 'black',
    					width : 1
    				})
    			})
    		})
        }
    });

	var selectedStyle = function(feature) {
    	var researchYn = feature.getProperties().research_yn;
    	var color = style.selected[researchYn];
		return new ol.style.Style({
			image : new ol.style.Circle({
				radius : 10,
				fill : new ol.style.Fill({
					color : color
				}),
				stroke : new ol.style.Stroke({
					color : 'white',
					width : 2
				})
			})
		});
	}

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

	var selectedDrawStyle = function(feature) {
		return style = new ol.style.Style({
			image : new ol.style.Circle({
				radius : 7,
				fill : new ol.style.Fill({
					color : '#ffcc33'
				}),
				stroke : new ol.style.Stroke({
					color : 'red',
					width : 2
				})
			})
		});
	}

	var pokestopSelect = new ol.interaction.Select({
		condition: ol.events.condition.click,
		layers: [pokestopLayer],
		style: selectedStyle,
		filter: function(feature) {
			if(!Pokemap.insertMode) {
				return feature;
			}
		}
	});
	pokestopSelect.on('select', function(event) {
		var features = event.selected;
		var feature = features[0];
		var overlayName = 'popup-overlay';

		if (feature) {
			var title = feature.get('title');
	        var content = '<p>The location you clicked was:</p>' + title;
	        var coordinate = feature.getGeometry().getCoordinates();
	        showOverlayPopup(overlayName, coordinate, content);
		} else {
	    	clearOverlayPopup(overlayName);
	    }
	});

	var showOverlayPopup = function(overlayName, coordinate, content) {
		var overlay = map.getOverlayById(overlayName);
        var element = overlay.getElement();
	    if(overlay) {
	        overlay.setPosition(coordinate);
	    }
	    $(element).html(content).visible();
	}

	var clearOverlayPopup = function(overlayName) {
		var overlay = map.getOverlayById(overlayName);
        var element = overlay.getElement();
	    if(overlay) {
	        overlay.setPosition(undefined);
	    }
	    $(element).invisible();
	}

	// insert
	var draw = new ol.interaction.Draw({
		source: source,
		type: 'Point'
	});
	draw.on('drawstart', function(event) {
		drawLayer.getSource().clear();
	});
	draw.on('drawend', function(event) {
		draw.setActive(false);
	});

	var drawSelect = new ol.interaction.Select({
		condition: ol.events.condition.click,
		layers: [drawLayer],
		style: selectedDrawStyle,
		filter: function(feature) {
			if(Pokemap.insertMode) {
				return feature;
			}
		}
	});

	var translate = new ol.interaction.Translate({
		features : drawSelect.getFeatures()
	});

	// 지도 위 팝업
    var popupOverlay = new ol.Overlay({
        id: 'popup-overlay',
        element: document.getElementById('popupOverlay'),
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        },
        offset: [10, 10],
        positioning: 'top'
    });

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
        }).extend([pokestopSelect]),	//new app.Drag(),
        view : new ol.View({
            projection: projection,
            center: new ol.geom.Point(centerPoint).transform(dataProjection, projection).getCoordinates(),
            zoom: 14,
            minZoom: 7,
            maxZoom: 19
        }),
        overlays: [popupOverlay]
    });

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
        	node = formatWFS.writeTransaction([feature], null, null, formatGML);
        	break;

        case 'update':
        	node = formatWFS.writeTransaction(null, [feature], null, formatGML);
        	break;

        case 'delete':
        	node = formatWFS.writeTransaction(null, null, [feature], formatGML);
        	break;
    	}

    	var payload = new XMLSerializer().serializeToString(node);
    	$.ajax(callGeoserverUrl + '/wfs', {
    		service: 'WFS',
            type: 'POST',
            dataType: 'xml',
            processData: false,
            contentType: 'text/xml',
            data: payload,
    	    success: function(data) {
    	    	//console.log(formatWFS.readTransactionResponse(data));
    	    },
    	    error: function(e) {
    	    	console.error(e);
    	    },
    	    context: this
    	}).done(function() {
    		Pokemap.GIS.clearMap();
    	    Pokemap.GIS.removeInteraction();
    	});
    };

    /**
     * 파라미터로 받은 좌표로 Feature를 생성하여 리턴한다.
     * @param   {string} geomType (Point, Polygon)
     * @param   {Array<string>} coord
     * @returns {Object} ol.Feature
     */
    var getFeatureByCoord = function(geomType, coord) {
        var shape = {
            'Point': new ol.geom.Point(coord),
            'LineString': new ol.geom.LineString(coord),
            'Polygon': new ol.geom.Polygon([coord])
        }

        return feature = new ol.Feature({
            geometry: shape[geomType],
            location: shape[geomType]	// for wfs-t
        });
    }

    var transformTo4326 = function(coord) {
        var transCoord = [];
        if(coord) {
            transCoord = ol.proj.transform(coord, projection, 'EPSG:4326');
        }
        return transCoord;
    }


    return {
    	create: function(element) {
    		map.setTarget(element);
    		return map;
    	},
    	addInteraction: function() {
    		map.addInteraction(draw);
    		map.addInteraction(drawSelect);
    		map.addInteraction(translate);
    		draw.setActive(true);
    	},
    	removeInteraction: function() {
    		map.removeInteraction(draw);
    		map.removeInteraction(drawSelect);
    		map.removeInteraction(translate);
    	},
    	addPoint: function(data) {
    		var drawPoint = drawLayer.getSource().getFeatures()[0];
    		if(drawPoint) {
            	var coord = drawPoint.getGeometry().getCoordinates();
    	        var transCoord = transformTo4326(coord);
    			var feature = getFeatureByCoord('Point', transCoord);
    			feature.setGeometryName('location');

    			for(var property in data) {
    				feature.set(property, data[property]);
    			}

    			transactWFS('insert', feature);
    		} else {
    			alert('지점을 선택해주세요.');
    		}
    	},
    	clearMap: function() {
    	    drawLayer.getSource().clear();
    	    drawSelect.getFeatures().clear();
    	    pokestopLayer.getSource().clear();
    	    pokestopSelect.getFeatures().clear();
    	}
    }
}
