#!/bin/bash

set -e

mkdir -p src/webapp/lib/angular
cp node_modules/angular/angular.js src/webapp/lib/angular/angular.js

echo "已拷贝 angular.js 到 src/webapp/lib/angular/"

mkdir -p src/webapp/lib/lodash
cp node_modules/lodash/lodash.min.js src/webapp/lib/lodash/lodash.min.js

echo "已拷贝 lodash.min.js 到 src/webapp/lib/lodash/" 