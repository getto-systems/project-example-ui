#!/bin/sh

deploy_main(){
  local version
  version=$(cat .release-version)

  deploy_build_ui
  deploy_rewrite_version
  deploy_cp_public
  deploy_cp_secure

  deploy_cp_public_index "0.7.0"
  deploy_cp_public_index "0.7.1"
  deploy_cp_public_index "0.7.2"
  deploy_cp_public_index "0.7.3"
}
deploy_build_ui(){
  npm run build
}
deploy_rewrite_version(){
  for file in $(find example/public/dist example/public/root -name '*.html'); do
    if [ -f "$file" ]; then
      sed -i -e "s|/dist/|/$version/|g" "$file"
    fi
  done
}
deploy_cp_public(){
  local metadata
  local file
  metadata=$(node example/public/metadata.js)

  aws s3 cp \
    --acl private \
    --cache-control "public, max-age=31536000" \
    --metadata "$metadata" \
    --recursive \
    example/public/dist s3://$AWS_S3_PUBLIC_BUCKET/$version

  cp example/public/dist/update/moveToNextVersion.js example/public/root/

  for file in example/public/root/*; do
    aws s3 cp \
      --acl private \
      --cache-control "public, max-age=86400" \
      --metadata "$metadata" \
      $file "s3://$AWS_S3_PUBLIC_BUCKET/$(basename $file)"
  done
}
deploy_cp_secure(){
  local metadata
  local file
  metadata=$(node example/secure/metadata.js)

  aws s3 cp \
    --acl private \
    --cache-control "public, max-age=31536000" \
    --metadata "$metadata" \
    --recursive \
    example/secure/dist s3://$AWS_S3_SECURE_BUCKET/$version
}

deploy_cp_public_index(){
  # 歯抜けになってしまったパージョンのために index.html を埋める
  local metadata
  local file
  metadata=$(node example/public/metadata.js)

  aws s3 cp \
    --acl private \
    --cache-control "public, max-age=31536000" \
    --metadata "$metadata" \
    example/public/dist/index.html s3://$AWS_S3_PUBLIC_BUCKET/$1/index.html
}

deploy_main
