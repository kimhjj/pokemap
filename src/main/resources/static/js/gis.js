/**
 *
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) { // AMD
        define([root, 'ol'], factory);
    } else if (typeof module === 'object' && module.exports) { // CommonJS
        module.exports = factory(root, require('ol'));
    } else { // window
        root.pokemap = factory(root, root.ol);
    }
}(this, function (_this, ol) {

    if (ol === undefined || ol === null) {
        throw 'openlayers is required';
    }

    // policy
    var GEOSERVER_URL = 'http://localhost:8080/geoserver';
    var GEOSERVER_WORKSPACE = 'pokemap';
    var CALL_GEOSERVER_URL = GEOSERVER_URL + '/' + GEOSERVER_WORKSPACE;
    var PROJECTION = 'EPSG:3857';
    var DATA_PROJECTION = 'EPSG:4326';
    var CENTER_POINT = [126.942803, 37.483040];

    function pokemap(options) {
        if (!(this instanceof pokemap)) {
            throw 'pokemap is a constructor and should be called with the `new` keyword';
        }

        console.log(options);
        this._init(options);
    }

    pokemap.prototype._init = function (options) {
        /*var vworldTile = new ol.layer.Tile({
            title : 'VWorld Map',
            visible : true,
            source : new ol.source.XYZ({
                url : 'http://xdworld.vworld.kr:8080/2d/Base/201512/{z}/{x}/{y}.png'
            })
        });*/

        var vworldTile = new ol.layer.Tile({
              source: new ol.source.OSM(),
        });

        this.map = new ol.Map({
            target: options.target,
            layers: [vworldTile],
            controls: ol.control.defaults({zoom: false}),
            interactions: ol.interaction.defaults({shiftDragZoom : true}),
            view : new ol.View({
                projection: PROJECTION,
                center: new ol.geom.Point(CENTER_POINT).transform(DATA_PROJECTION, PROJECTION).getCoordinates(),
                zoom: 14,
                minZoom: 7,
                maxZoom: 19
            }),
        });
    }

    return pokemap;
}));
