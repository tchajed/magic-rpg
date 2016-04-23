#!/usr/bin/env gnuplot
# vim: ft=gnuplot

set title "Sample writing words"
set terminal svg size 1024,640 fname "Gill Sans" fsize 11 rounded dashed
set output "words.svg"

set xdata time
set timefmt "%Y-%m-%d %H:%M:%S"
set datafile separator "\t"

set format x "%m/%d\n%H:%M"
set key bottom right

# Line style for axes
set style line 80 lt rgb "#808080"

# Line style for grid
set style line 81 lt 0  # dashed
set style line 81 lt rgb "#808080"  # grey

set grid back linestyle 81
set border 3 back linestyle 80 # Remove border on top and right.  These
             # borders are useless and make it harder
             # to see plotted lines near the border.
    # Also, put it in grey; no need for so much emphasis on a border.
set xtics nomirror
set ytics nomirror

plot 'sample-writing-words.txt' using 1:2 pt 7 ps 0.5 with lines title 'words'
