#!/bin/sh

protobuf_main(){
    protobuf_generate_all "lib/z_details/db"
    protobuf_generate_all "lib/z_details/api"
}

protobuf_generate_all(){
    local root

    local protobuf
    local dest
    local proto
    local file

    root=$1
    protobuf=${root}/z_protobuf/
    dest=${root}/y_protobuf/

    rm -rf $dest/*

    for proto in $(find $protobuf -name '*.proto'); do
        file=${proto#$protobuf}
        file=${file%.proto}

        echo "${root} : ${file}"
        protobuf_generate $proto $dest $file
    done
}
protobuf_generate(){
    local source_proto
    local destination_dir
    local destination_base_path

    local pb_path
    local data_path

    source_proto=$1
    destination_dir=$2
    destination_base_path=$3

    pb_path="${destination_dir}/${destination_base_path}_pb.js"
    data_path="${destination_dir}/${destination_base_path}_pb.d.ts"

    mkdir -p $destination_dir && \
    rm -f $pb_path $data_path && \
    pbjs -t static-module -w es6 -o $pb_path $source_proto && \
    pbts -o $data_path $pb_path && \
    :
}

protobuf_main "$@"
