#!/bin/bash
sed -i -e "s/DYN_SOLR_HOST/$SOLR_HOST/g" /usr/share/nginx/html/scripts/config*.js

/usr/sbin/nginx -g 'daemon off;'


