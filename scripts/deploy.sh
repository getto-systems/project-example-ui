#!/bin/sh

deploy_main(){
  local version

  version=$(cat .release-version)

  deploy_upload_ui
  deploy_upload_docs
}
deploy_upload_ui(){
  npm run build

  deploy_upload public/dist s3://$AWS_S3_PUBLIC_BUCKET
  deploy_upload secure/dist s3://$AWS_S3_SECURE_BUCKET
}
deploy_upload_docs(){
  local docs_version

  mkdir docs
  cd docs

  docs_version=$(
    curl --silent "https://api.github.com/repos/$GITHUB_DOCS_REPO/releases/latest" | \
    grep '"tag_name":' | \
    sed -E 's/.*"([^"]+)".*/\1/' \
  )
  curl -sSL https://github.com/$GITHUB_DOCS_REPO/releases/download/$docs_version/docs.tar.gz -o docs.tar.gz
  tar -xz -f docs.tar.gz

  deploy_upload public/dist/doc s3://$AWS_S3_PUBLIC_BUCKET doc
  deploy_upload secure/dist/doc s3://$AWS_S3_SECURE_BUCKET doc
}
deploy_upload(){
  local path
  local root
  local location
  local url

  path=$1
  root=$2
  location=$3

  url=$root/$version

  if [ -n "$location" ]; then
    url=$url/$location
  fi

  aws s3 sync $path $url
}

deploy_main
