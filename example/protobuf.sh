#!/bin/sh

protobuf_main(){
  local root
  local base
  local lib
  local types
  local proto
  local file
  local name
  local pb_path
  local d_path

  root=example
  base=$root/protobuf/
  lib=$root/lib
  types=$root/types

  for proto in $(find $base -name '*.proto'); do
    file=${proto#$base}
    file=${file%.proto}

    pb_path=$lib/${file}_pb.js
    d_path=$types/${file}_pb.d.ts
    echo "$proto -> $pb_path ; $d_path"

    rm -f $pb_path $d_path && \
    mkdir -p $(dirname $pb_path) && \
    mkdir -p $(dirname $d_path) && \
    pbjs -t static-module -w es6 -o $pb_path $proto && \
    pbts -o $d_path $pb_path && \
    :
  done
}

protobuf_main "$@"
