function init() {
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

    // set map
    var map = new ol.Map({
        controls : [
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
                title : 'Base Maps',
                layers : [
                    vworldTile
                ]
            }),
        ],
        target: 'map',
        renderer: 'canvas',
        interactions : ol.interaction.defaults({
            shiftDragZoom : true
        }),
        view : new ol.View({
            projection: 'EPSG:3857',
            center : new ol.geom.Point(centerPoint).transform('EPSG:4326', 'EPSG:3857').getCoordinates(),
            zoom : 14,
            minZoom: 7
        })
    });
}