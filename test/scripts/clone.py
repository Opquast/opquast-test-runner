from shutil import copy
from os import listdir
from json import load

json_criteria = load(open('test/scripts/criteria.json'))
id = ""

for dir in listdir('test/fixtures'):
    if dir not in ['rules', 'rules-debug', 'rules-impossible', 'rules-stock', 'sets', 'sets-debug', 'sets-impossible', 'sets-stock'] and dir != id:
        for x in range(20):
            _id = json_criteria[id].replace('.', '-').replace('[', '').replace(']', '')
            _dir = json_criteria[dir].replace('.', '-').replace('[', '').replace(']', '').lower()

            for format in ['html', 'css', 'screen.css', 'print.css', 'js', 'json', 'rss', 'atom']:
                try:
                    copy ('test/fixtures/%s/%s-%s_%s.%s' % (id, _id, id, x + 1, format), 'test/fixtures/%s/%s-%s_%s.%s' % (dir, _dir, dir, x + 1, format))
                except:
                    pass

            for file in ['_all.json', 'robots.txt', 'favicon.ico', 'download.pdf']:
                try:
                    copy ('test/fixtures/%s/%s' % (id, file), 'test/fixtures/%s/%s' % (dir, file))
                except:
                    pass
