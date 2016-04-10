define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/_base/lang',
            'dojo/_base/Color',
            'dojo/on',
            'MultiBigWig/View/Track/MultiWiggleBase',
            'JBrowse/View/Track/_YScaleMixin',
            'JBrowse/Util',
            'JBrowse/View/Track/Wiggle/_Scale'
        ],
        function(
            declare,
            array,
            lang,
            Color,
            on,
            WiggleBase,
            YScaleMixin,
            Util,
            Scale
        ) {

return declare( [WiggleBase, YScaleMixin],
{
    _defaultConfig: function() {
        return Util.deepUpdate(
            lang.clone( this.inherited(arguments) ),
            {
                autoscale: 'local',
                style: {
                    pos_color: 'blue',
                    neg_color: 'red',
                    origin_color: '#888',
                    variance_band_color: 'rgba(0,0,0,0.3)'
                }
            }
        );
    },

    _getScaling: function( viewArgs, successCallback, errorCallback ) {

        this._getScalingStats( viewArgs, dojo.hitch(this, function( stats ) {

            //calculate the scaling if necessary
            if( ! this.lastScaling || ! this.lastScaling.sameStats( stats ) || this.trackHeightChanged ) {

                var scaling = new Scale( this.config, stats );

                // bump minDisplayed to 0 if it is within 0.5% of it
                if( Math.abs( scaling.min / scaling.max ) < 0.005 )
                    scaling.min = 0;

                // update our track y-scale to reflect it
                this.makeYScale({
                    fixBounds: true,
                    min: scaling.min,
                    max: scaling.max
                });

                // and finally adjust the scaling to match the ruler's scale rounding
                scaling.min = this.ruler.scaler.bounds.lower;
                scaling.max = this.ruler.scaler.bounds.upper;
                scaling.range = scaling.max - scaling.min;

                this.lastScaling = scaling;
                this.trackHeightChanged=false; //reset flag
            }

            successCallback( this.lastScaling );
        }), errorCallback );
    },

    updateStaticElements: function( coords ) {
        this.inherited( arguments );
        this.updateYScaleFromViewDimensions( coords );
    },

    _drawFeatures: function( scale, leftBase, rightBase, block, canvas, pixels, dataScale ) {
        var thisB = this;
        var context = canvas.getContext('2d');
        var canvasHeight = canvas.height;

        var ratio = Util.getResolution( context, this.browser.config.highResolutionMode );
        var toY = lang.hitch( this, function( val ) {
            return canvasHeight * ( 1-dataScale.normalize(val) ) / ratio;
        });
        var originY = toY( dataScale.origin );

        var disableClipMarkers = this.config.disable_clip_markers;
        var map = {};
        array.forEach( pixels, function(p,i) {
            array.forEach( p, function(s,j) {
                if(!s) return;
                var score = toY(s['score']);
                var f = s['feat'];
                var source = f.get('source');
                if( score <= canvasHeight || score > originY) { // if the rectangle is visible at all
                    if( score <= originY ) {
                        // bar goes upward
                    
                        context.fillStyle = this.getConfForFeature('style.pos_color',f);
                        thisB._fillRectMod( context, i, score, 1, 1);
                        var x = (map[source]||{}).x || i;
                        var y = (map[source]||{}).y || score;
                        if(i==x+1||i==x) {
                            context.beginPath();
                            context.moveTo(x, y);
                            context.lineTo(i,score);
                            context.stroke();
                        }
                        else {
                            context.beginPath();
                            context.moveTo(x,y);
                            context.lineTo(x+1,canvasHeight);
                            context.lineTo(i-1,canvasHeight);
                            context.lineTo(i,score);
                            context.stroke();
                        }
                        map[source] = {x: i, y: score};
                        if( !disableClipMarkers && score < 0 ) { // draw clip marker if necessary
                            context.fillStyle = this.getConfForFeature('style.clip_marker_color',f) || this.getConfForFeature('style.neg_color',f);
                            thisB._fillRectMod( context, i, 0, 1, 3 );
                        }
                    }
                    else {
                        // bar goes downward
                        context.fillStyle = this.getConfForFeature('style.neg_color',f);
                        thisB._fillRectMod( context, i, originY, 1, 1 );
                        if( !disableClipMarkers && score >= canvasHeight ) { // draw clip marker if necessary
                            context.fillStyle = this.getConfForFeature('style.clip_marker_color',f) || this.getConfForFeature('style.pos_color',f);
                            thisB._fillRectMod( context, i, canvasHeight-3, 1, 3 );

                        }
                    }
                }
            }, this );
            
        }, this );
    }
});

});
