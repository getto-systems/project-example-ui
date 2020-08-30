#!/bin/sh

deploy_main(){
  local version
  version=$(cat .release-version)

  deploy_build_ui
  deploy_rewrite_version
  deploy_cp_public
  deploy_cp_secure
}
deploy_build_ui(){
  npm run build
}
deploy_rewrite_version(){
  for file in $(find public/dist public/root -name '*.html'); do
    if [ -f "$file" ]; then
      sed -i -e "s|/dist/|/$version/|g" "$file"
    fi
  done
}
deploy_cp_public(){
  local metadata
  local file
  metadata=$(node metadata/public.js)

  aws s3 cp \
    --acl private \
    --cache-control "public, max-age=31536000" \
    --metadata "$metadata" \
    --recursive \
    public/dist s3://$AWS_S3_PUBLIC_BUCKET/$version

  cp public/dist/update.js public/root/

  for file in public/root/*; do
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
  metadata=$(node metadata/secure.js)

  aws s3 cp \
    --acl private \
    --cache-control "public, max-age=31536000" \
    --metadata "$metadata" \
    --recursive \
    secure/dist s3://$AWS_S3_SECURE_BUCKET/$version
}

deploy_main
