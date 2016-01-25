define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/_base/lang',
            'JBrowse/View/Track/WiggleBase'
        ],
        function(
            declare,
            array,
            lang,
            WiggleBase
        ) {

return declare( WiggleBase, {

    constructor: function( args ) {
        this.map = {};
        array.forEach( args.config.urlTemplates, function(urlTemplate, i) { this.map[urlTemplate.name] = i; }, this);
    },
    _calculatePixelScores: function( canvasWidth, features, featureRects ) {
        var scoreType = this.config.scoreType;
        var pixelValues = new Array( canvasWidth );
        var thisB = this;
        // make an array of the max score at each pixel on the canvas
        array.forEach( features, function( f, i ) {
            var store = f.source;
            var fRect = featureRects[i];
            var jEnd = fRect.r;
            var score = f.get('score');
            var k = thisB.map[f.get('source')];
            var ks = Object.keys(thisB.map).length;
            for( var j = Math.round(fRect.l); j < jEnd; j++ ) {
                if(!pixelValues[j]) {
                    pixelValues[j] = new Array( ks );
                }
                if(!pixelValues[j][k]) {
                    pixelValues[j][k] = { score: score, feat: f };
                }
            }
        }, this);

        return pixelValues;
    }

});
});
