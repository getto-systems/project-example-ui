bump_build
bump_sync package.json 's/"version": "[0-9.-]\+"/"version": "'$(cat .release-version)'"/'
bump_sync storybook/package.json 's/"version": "[0-9.-]\+"/"version": "'$(cat .release-version)'"/'
