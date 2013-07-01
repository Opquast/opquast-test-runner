from shutil import copy
from os import listdir
from json import load

json_criteria = load(open('test/scripts/criteria.json'))
id = "10107"

for dir in listdir('test/fixtures'):
    if dir not in ['rules', 'rules-debug', 'rules-impossible', 'rules-stock', 'sets', 'sets-debug', 'sets-impossible', 'sets-stock'] and dir != id:
        for x in range(20):
            _id = json_criteria[id].replace('.', '-').replace('[', '').replace(']', '')
            _dir = json_criteria[dir].replace('.', '-').replace('[', '').replace(']', '').lower()
            
            try:
                copy ('test/fixtures/%s/%s-%s_%s.html' % (id, _id, id, x + 1), 'test/fixtures/%s/%s-%s_%s.html' % (dir, _dir, dir, x + 1))
            except:
                pass
            
            try:
                copy ('test/fixtures/%s/%s-%s_%s.css' % (id, _id, id, x + 1), 'test/fixtures/%s/%s-%s_%s.css' % (dir, _dir, dir, x + 1))
            except:
                pass
            
            try:
                copy ('test/fixtures/%s/%s-%s_%s.print.css' % (id, _id, id, x + 1), 'test/fixtures/%s/%s-%s_%s.print.css' % (dir, _dir, dir, x + 1))
            except:
                pass
            
            try:
                copy ('test/fixtures/%s/%s-%s_%s.screen.css' % (id, _id, id, x + 1), 'test/fixtures/%s/%s-%s_%s.screen.css' % (dir, _dir, dir, x + 1))
            except:
                pass
            
            try:
                copy ('test/fixtures/%s/%s-%s_%s.js' % (id, _id, id, x + 1), 'test/fixtures/%s/%s-%s_%s.js' % (dir, _dir, dir, x + 1))
            except:
                pass
            
            try:
                copy ('test/fixtures/%s/_all.json' % (id, _id, id, x + 1), 'test/fixtures/%s/_all.json' % (dir, _dir, dir, x + 1))
            except:
                pass
            
            try:
                copy ('test/fixtures/%s/%s-%s_%s.json' % (id, _id, id, x + 1), 'test/fixtures/%s/%s-%s_%s.json' % (dir, _dir, dir, x + 1))
            except:
                pass
            
            try:
                copy ('test/fixtures/%s/%s-%s_%s.rss' % (id, _id, id, x + 1), 'test/fixtures/%s/%s-%s_%s.rss' % (dir, _dir, dir, x + 1))
            except:
                pass
            
            try:
                copy ('test/fixtures/%s/%s-%s_%s.atom' % (id, _id, id, x + 1), 'test/fixtures/%s/%s-%s_%s.atom' % (dir, _dir, dir, x + 1))
            except:
                pass
