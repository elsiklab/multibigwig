define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/_base/lang',
            'dojo/_base/event',
            'dojo/dom-construct',
            'dojo/on',
            'dojo/mouse',
            'JBrowse/View/Track/BlockBased',
            'JBrowse/View/Track/_ExportMixin',
            'JBrowse/View/Track/_TrackDetailsStatsMixin',
            'JBrowse/View/Dialog/SetTrackHeight',
            'JBrowse/Util',
            'JBrowse/has',
            'JBrowse/View/Track/WiggleBase'
        ],
        function(
            declare,
            array,
            lang,
            domEvent,
            dom,
            on,
            mouse,
            BlockBasedTrack,
            ExportMixin,
            DetailStatsMixin,
            TrackHeightDialog,
            Util,
            has,
            WiggleBase
        ) {

return declare( WiggleBase, {

    constructor: function() {
        this.map = {};
        array.forEach( args.config.urlTemplates, function(urlTemplate, i) { this.map[urlTemplate.name] = i; }, this);
        this.inherited(arguments);
    }
    _calculatePixelScores: function( canvasWidth, features, featureRects ) {
        var scoreType = this.config.scoreType;
        var pixelValues = new Array( canvasWidth );
        var thisB = this;
        // make an array of the max score at each pixel on the canvas
        array.forEach( features, function( f, i ) {
            var store = f.source;
            var fRect = featureRects[i];
            var jEnd = fRect.r;
            var score = f.get(scoreType) || f.get('score');
            var k = thisB.map[f.storeName];
            for( var j = Math.round(fRect.l); j < jEnd; j++ ) {
                if ( pixelValues[j] && pixelValues[j][k]['lastUsedStore'] == store ) {
                    /* Note: if the feature is from a different store, the condition should fail,
                     *       and we will add to the value, rather than adjusting for overlap */
                    pixelValues[j][k]['score'] = Math.max( pixelValues[j][k]['score'], score );
                }
                else if ( pixelValues[j][k] ) {
                    pixelValues[j][k]['score'] = pixelValues[j][k]['score'] + score;
                    pixelValues[j][k]['lastUsedStore'] = store;
                }
                else {
                    if(!pixelValues[j][k]) pixelValues[j][k] = []
                    pixelValues[j][k] = { score: score, lastUsedStore: store, feat: f };
                }
            }
        }, this);
        // when done looping through features, forget the store information.
        for (var i=0; i<pixelValues.length; i++) {
            for (var j=0; i<pixelValues[i].length; j++) {
                if ( pixelValues[i]&&pixelValues[i][j] ) {
                    delete pixelValues[i][j]['lastUsedStore'];
                }
            }
        }
        
        return pixelValues;
    }

});
});
