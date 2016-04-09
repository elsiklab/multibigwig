# multibigwig

A JBrowse plugin for plotting multiple bigwig files on a single track. Includes a storeclass
that accepts multiple bigwig URLs and a custom tracktype for rendering the subtracks.


![](img/out.png)


## Example track JSON

      {
         "storeClass" : "MultiBigWig/Store/SeqFeature/MultiBigWig",
         "urlTemplates" : [
            {"url":"bw/C0535ACXX_LJA288_0.bw","name":"C0535ACXX_LJA288_0", "color": "red"},
            {"url":"bw/C0535ACXX_LJA38_0.bw","name":"C0535ACXX_LJA38_0", "color": "red"},
            {"url":"bw/C0535ACXX_LJA96_0.bw","name":"C0535ACXX_LJA96_0", "color": "red"},
            {"url":"bw/D09A8ACXX_LJA201_0.bw","name":"D09A8ACXX_LJA201_0", "color": "green"},
            {"url":"bw/D09A8ACXX_LJA232a_0.bw","name":"D09A8ACXX_LJA232a_0", "color": "green"},
            {"url":"bw/D09A8ACXX_LJA233_0.bw","name":"D09A8ACXX_LJA233_0", "color": "green"},
            {"url":"bw/D09A8ACXX_LJA234b_0.bw","name":"D09A8ACXX_LJA234b_0", "color": "green"},
            {"url":"bw/D09A8ACXX_LJA236_0.bw","name":"D09A8ACXX_LJA236_0", "color": "green"},
            {"url":"bw/D09A8ACXX_LJA237_0.bw","name":"D09A8ACXX_LJA237_0", "color": "green"},
            {"url":"bw/D09A8ACXX_LJA240_0.bw","name":"D09A8ACXX_LJA240_0", "color": "green"},
            {"url":"bw/D09A8ACXX_LJA241_0.bw","name":"D09A8ACXX_LJA241_0", "color": "green"}
         ],
         "showTooltips": true,
         "label" : "Multibigwig",
         "type" : "MultiBigWig/View/Track/MultiWiggle/MultiDensity"
      }


Example tracks.conf


    [tracks.multibigwig]
    key=RNA-seq BigWig
    type=MultiBigWig/View/Track/MultiWiggle/MultiDensity
    style.height=300
    showTooltips=true
    storeClass=MultiBigWig/Store/SeqFeature/MultiBigWig
    urlTemplates+=json:{"url":"bw/C0535ACXX_LJA143_0.bw", "name": "C0535ACXX_LJA143_0", "color": "red"}
    urlTemplates+=json:{"url":"bw/C0535ACXX_LJA156_0.bw", "name": "C0535ACXX_LJA156_0", "color": "red"}
    urlTemplates+=json:{"url":"bw/C0535ACXX_LJA157_0.bw", "name": "C0535ACXX_LJA157_0", "color": "red"}
    urlTemplates+=json:{"url":"bw/C0535ACXX_LJA158_0.bw", "name": "C0535ACXX_LJA158_0", "color": "red"}
    urlTemplates+=json:{"url":"bw/C0535ACXX_LJA162_0.bw", "name": "C0535ACXX_LJA162_0", "color": "red"}
    urlTemplates+=json:{"url":"bw/C0535ACXX_LJA163_0.bw", "name": "C0535ACXX_LJA163_0", "color": "red"}


## Options

* urlTemplates - An array of subtracks, containing the url for a BW file, name, and optionally color for subtrack labels
* showLabels - Display actual labels inside the small icons specified by showTooltips (boolean)
* showTooltips - Display small tooltips over the labels. If specified without showLabels, the label is blank and little squares can be hovered over (boolean)
* labelFont - Specify subtrack label font CSS e.g. "6px sans-serif"
* labelFontSize - Specify subtrack label font size CSS e.g. "6px"
* style->height - Total height of the track


## Install

- Clone repo into plugins folder in JBrowse and name folder MultiBigWig
- Add "plugins": ["MultiBigWig"] to trackList.json or jbrowse_conf.json


Still in beta! Feel free to provide feedback
