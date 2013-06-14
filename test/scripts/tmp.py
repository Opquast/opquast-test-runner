from shutil import copy
from os import listdir
from json import load

json_criteria = load(open('criteria.json'))
bp = "2"
id = "501"

for dir in listdir('test/fixtures'):
    try:
        if str(int(dir)) == dir and dir != id:
            [copy ('test/fixtures/%s/%s-%s_%s.html' % (id, bp, id, x + 1), 'test/fixtures/%s/%s-%s_%s.html' % (dir, json_criteria[dir].replace('.', '-').replace('[', '').replace(']', ''), dir, x + 1)) for x in range(17)]
    except:
        pass

