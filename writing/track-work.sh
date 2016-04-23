#!/bin/bash

files=( "$@" )

track() {
    time=$(date "+%F %H:%M:%S")
    words=$(wc -w $files | awk '{print $1}')
    echo -e "$time\t$words"
}

while [[ true ]]; do
    track
    gsleep 15s
done
