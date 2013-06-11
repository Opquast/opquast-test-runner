from shutil import copy
from os import listdir
from json import load

json_criteria = load(open('test/criteria.json'))

for dir in listdir('test/fixtures'):
    try:
        if str(int(dir)) == dir and dir != "501":
            [copy ('test/fixtures/501/2-501_%s.html' % (x + 1), 'test/fixtures/%s/%s-%s_%s.html' % (dir, json_criteria[dir].replace('.', '-').replace('[', '').replace(']', ''), dir, x + 1)) for x in range(17)]
    except:
        pass

