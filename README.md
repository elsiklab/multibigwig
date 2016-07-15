# multibigwig

A JBrowse plugin for plotting multiple bigwig files on a single track. Includes a storeclass
that accepts multiple bigwig URLs and a custom tracktype for rendering the subtracks.


![](img/out.png)
Figure with MultiDensity and MultiXYPlot with different group colorings


## Example configs

Example for trackList.json (MultiDensity as example)

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


Example for tracks.conf (MultiXYPlot as example)

    [tracks.multibigwigxy]
    key=RNA-seq BigWig XY
    type=MultiBigWig/View/Track/MultiWiggle/MultiXYPlot
    style.height=100
    storeClass=MultiBigWig/Store/SeqFeature/MultiBigWig
    max_score=400
    autoscale=global
    urlTemplates+=json:{"url":"bw/C0535ACXX_LJA276_0.bw", "name": "C0535ACXX_LJA276_0.bw", "color": "#235"}
    urlTemplates+=json:{"url":"bw/C0535ACXX_LJA288_0.bw", "name": "C0535ACXX_LJA288_0.bw", "color": "#a54"}
    urlTemplates+=json:{"url":"bw/C0535ACXX_LJA38_0.bw", "name": "C0535ACXX_LJA38_0.bw", "color": "#ae2"}
    urlTemplates+=json:{"url":"bw/C0535ACXX_LJA96_0.bw", "name": "C0535ACXX_LJA96_0.bw", "color": "#339"}
    urlTemplates+=json:{"url":"bw/D09A8ACXX_LJA201_0.bw", "name": "D09A8ACXX_LJA201_0.bw", "color": "#156"}
    urlTemplates+=json:{"url":"bw/D09A8ACXX_LJA235_0.bw", "name": "D09A8ACXX_LJA235_0.bw", "color": "#918"}
    


## Options

General options

* urlTemplates - An array of subtracks, containing the url for a BW file, name, and optionally color for subtrack labels. It can also specify "nonCont": true to enable discontinuous lines
* style->height - Total height of the track
* autoscale - Can be global or local. Global is the max of all bigwig tracks globally. Local is same thing but local, so scrolling around with autoscale local takes time for large number of bigwigs. Note: track types can adjust autoscale type via the track menu
* max_score - The max score to use. If autoscale global is used, max_score overrides. Note, track types can adjust max score via the track menu
* randomizeColors - randomize the colors to be used on each subtrack. Boolean, default false


MultiDensity specific options

* showLabels - Display actual labels inside the small icons specified by showTooltips (boolean)
* showTooltips - Display small tooltips over the labels. If specified without showLabels, the label is blank and little squares can be hovered over (boolean)
* labelFont - Specify subtrack label font CSS e.g. "6px sans-serif"
* labelFontSize - Specify subtrack label font size CSS e.g. "6px"


## Install

- Clone repo into plugins folder in JBrowse and name folder MultiBigWig
- Add "plugins": ["MultiBigWig"] to trackList.json or jbrowse_conf.json


Still in beta! Feel free to provide feedback
