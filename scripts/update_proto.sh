#!/bin/sh

update_proto_main(){
  local target
  local proto
  local file
  local name
  local pb_path
  local d_path

  target=$1

  for proto in $(find $target/proto -name '*.proto'); do
    file=${proto#$target/proto/}
    file=${file%.proto}
    name=$(echo $file | sed 's|/|_|g')

    pb_path=$target/lib/y_static/${file}_pb.js
    d_path=$target/${name}_pb.d.ts

    rm -f $pb_path $d_path && \
    mkdir -p $(dirname $pb_path) && \
    pbjs -t static-module -w es6 -o $pb_path $proto && \
    pbts -o $d_path $pb_path && \
    :
  done
}

update_proto_main "$@"