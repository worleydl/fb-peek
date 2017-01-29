from bs4 import BeautifulSoup
from datetime import datetime

import requests

batch_size = 250
solr_ep = 'http://solr:8983/solr/fbpeek'

archive_path = '/data/html'

messages_file = 'messages.htm'
timeline_file = 'timeline.htm'

# Sample date from archive - Thursday, March 17, 2005 at 8:08pm EST
# We strip the timezone
dt_format = '%A, %B %d, %Y at %I:%M%p'

identifier = 0

def index_docs(docs):
    requests.post(solr_ep + '/update?commit=true', json=docs)


# PROCESS TIMELINE
print('Processing timeline data...')
soup = BeautifulSoup(open('{}/{}'.format(archive_path, timeline_file)), 'html.parser')
contents = soup.find('div', {'class' : 'contents'})

comments = []
curr_date = None
elements = contents.find_all('div')
for element in elements:
    classes = element.get('class') or []

    # Meta tags are dates, update the current timestamp
    if 'meta' in classes:
        curr_date = datetime.strptime(element.get_text().rsplit(' ', 1)[0], dt_format)

    # Everything else is data to index
    else:
        if curr_date is None:
            continue

        comment = {
            'id': identifier,
            'content_type': 'timeline',
            'content': element.get_text(),
            'date': curr_date.isoformat() + 'Z'
        }
        comments.append(comment)
        identifier += 1

    if len(comments) >= batch_size:
        index_docs(comments)
        comments = []

# One last push
index_docs(comments)

# END OF TIMELINE PROCESSING

# PROCESS MESSAGES
print('Processing message data...')
soup = BeautifulSoup(open('{}/{}'.format(archive_path, messages_file)), 'html.parser')
threads = soup.find_all('div', {'class' : 'thread'})

messages = []
for thread in threads:
    ref = thread.find(text=True, recursive=False)

    elements = thread.find_all('div', {'class' : 'message'})
    for element in elements:
        user = element.find('span', {'class' : 'user'}).get_text()
        meta = element.find('span', {'class' : 'meta'}).get_text()
        content = element.findNext('p').get_text()

        curr_date = datetime.strptime(str(meta).rsplit(' ', 1)[0], dt_format)

        msg = {
            'id': identifier,
            'content_ref': ref,
            'content_type': 'msg',
            'content': content,
            'content_meta': user,
            'date': curr_date.isoformat() + 'Z'
        }
        messages.append(msg)
        identifier += 1

        if len(messages) >= batch_size:
            index_docs(messages)
            messages = []

index_docs(messages)

# END MESSAGE PROCESSING
print('Done.')
