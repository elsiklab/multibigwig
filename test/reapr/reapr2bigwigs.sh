#!/usr/bin/env bash

ARRAY=(ref pos perfect_cov read_cov prop_cov orphan_cov bad_insert_cov bad_orient_cov read_cov_r prop_cov_r orphan_cov_r bad_insert_cov_r bad_orient_cov_r frag_cov frag_cov_err FCD_mean clip_fl clip_rl clip_fr clip_rr FCD_err mean_frag_length);
COLORS=(red green yellow brown purple black grey blue darkred darkgreen lightblue orange pink magenta blueviolet limegreen olive aqua wheat tan maroon cornflowerblue)

for i in {2..21}; do
    elt=${ARRAY[$i]};
    var=${i}_${elt};
    echo $var;
    gunzip -c $1 | 
     awk -v var="$i" '{print $1,$2,$2+1,$var}' > $var.bg;
     bedGraphToBigWig $var.bg chrom.sizes $var.bw;
     rm $var.bg;
done;

echo [tracks.REAPR] >> tracks.conf;
echo type=MultiBigWig/View/Track/MultiWiggle/MultiXYPlot >> tracks.conf;
echo storeClass=MultiBigWig/Store/SeqFeature/MultiBigWig >> tracks.conf;

for i in {2..21}; do
    elt=${ARRAY[$i]};
    color=${COLORS[$i]};
    var=${i}_${elt};
    echo "urlTemplates+=json:{\"url\": \"$var.bw\", \"label\": \"$var\", \"color\": \"$color\"}" >> tracks.conf
done;
