FROM solr:6.1

USER root
RUN rm -rf /opt/solr/server/solr/*
ADD solr-home /opt/solr/server/solr/
RUN chown -R 8983:8983 /opt/solr/server/solr
USER solr
