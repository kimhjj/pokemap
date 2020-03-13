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
	var pokestopLayer = new ol.layer.Image({
        id: 'pokestop_layer',
        visible: true,
        //zIndex : 30,
        source: new ol.source.ImageWMS({
            url: 'http://localhost:8080/geoserver/pokemap/wms',
            params: {
                'VERSION' : '1.1.1',
                'SRS': 'EPSG:3857',
                'STYLES': 'pokestop',
                tiled: true,
                layers: ['pokestop_info']
                //query_layers : wmsLayerKeys,
                //CQL_FILTER: queryStrings
            }
        })
    });
	var drawVector = new ol.layer.Vector({
		id: 'draw_layer',
        visible: true,
        //zIndex : 50,
        source: new ol.source.Vector({
            features: new ol.Collection()
        })
	});

	var selectInteraction = new ol.interaction.Select({
		layers : [pokestopLayer]
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
                    pokestopLayer
                ]
            }),
            new ol.layer.Group({
            	title: 'Vector',
            	layers: [
            		drawVector
            	]
            })
        ],
        renderer: 'canvas',
        interactions: ol.interaction.defaults({
            shiftDragZoom : true
        }).extend([new app.Drag(), selectInteraction]),
        view : new ol.View({
            projection: 'EPSG:3857',
            center: new ol.geom.Point(centerPoint).transform('EPSG:4326', 'EPSG:3857').getCoordinates(),
            zoom: 14,
            minZoom: 7,
            maxZoom: 19
        })
    });

   /* map.on('singleclick', function(event){
        if (event.dragging) return;

        var coord = event.coordinate;
        var transCoord = transformTo4326(coord);
        var feature = getFeatureByCoord('Point', transCoord);
        // column name
    	feature.setGeometryName('location');

    	return if(confirm('등록하시겠습니까?'));

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
    	}
    }
}

//var getCurProj: function() {
//    return map.getView().getProjection();
//},


