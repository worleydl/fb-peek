until $(curl --output /dev/null --silent --head --fail http://solr:8983/solr/fbpeek/select?); do
    printf 'Waiting on Solr init...'
    sleep 5
done

python indexer.py
