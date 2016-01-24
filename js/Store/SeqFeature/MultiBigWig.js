define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/_base/array',
            'dojo/_base/url',
            'dojo/promise/all',
            'JBrowse/Model/DataView',
            'JBrowse/has',
            'JBrowse/Errors',
            'JBrowse/Store/SeqFeature',
            'JBrowse/Store/DeferredStatsMixin',
            'JBrowse/Store/DeferredFeaturesMixin',
            'JBrowse/Store/SeqFeature/BigWig',
            'JBrowse/Util',
            'JBrowse/Model/XHRBlob'
        ],
        function(
            declare,
            lang,
            array,
            urlObj,
            all,
            jDataView,
            has,
            JBrowseErrors,
            SeqFeatureStore,
            DeferredFeaturesMixin,
            DeferredStatsMixin,
            BigWig,
            Util,
            XHRBlob
        ) {
return declare([ SeqFeatureStore, DeferredFeaturesMixin, DeferredStatsMixin ],
{
    /**
     * Data backend for multiple bigwig files 
     */
    constructor: function( args ) {
        var thisB = this;
        this.stores = array.map( args.urlTemplates, function( urlTemplate ) {
            console.log(urlTemplate);
            return new BigWig( dojo.mixin( args, { urlTemplate: urlTemplate.url, name: urlTemplate.name } ) );
        });

        all( array.map( this.stores, function(store) {
            return store._deferred.features
        })).then( function() {
            thisB._deferred.features.resolve({success: true});
            thisB._deferred.stats.resolve({success: true});
        },
        lang.hitch( this, '_failAllDeferred' ));
    },

    
    getFeatures: function( query, featureCallback, endCallback, errorCallback ) {
        var retobj = {}; 
        array.forEach( this.stores, function(store) {
            store._getFeatures( query,
                function(features) {
                    features.storeName = store.name;
                    featureCallback(features);
                }
                , endCallback
                , errorCallback
            );
        });


    },

    saveStore: function() {
        return {
            urlTemplates: this.config.urlTemplates
        };
    }

});

});
