#!/bin/sh

update_proto_main(){
  local target
  local proto
  local file
  local name
  local pb_path
  local d_path

  target=$1

  for proto in $(find ./proto/$target -name '*.proto'); do
    file=${proto#proto/}
    file=${file%.proto}
    name=$(echo $file | sed 's|/|_|g')

    pb_path=$target/lib/${file}_pb.js
    d_path=types/$target/${name}_pb.d.ts

    rm -f $pb_path $d_path && \
    mkdir -p $(dirname $pb_path) && \
    pbjs -t static-module -w es6 -o $pb_path $proto && \
    pbts -o $d_path $pb_path && \
    :
  done
}

update_proto_main "$@"
