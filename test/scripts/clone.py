from shutil import copy
from os import listdir
from json import load

json_criteria = load(open('test/scripts/criteria.json'))
id = "21320"
number = 20

for dir in listdir('test/fixtures'):
    if str(int(dir)) == dir and dir != id:
        try:
            [copy ('test/fixtures/%s/%s-%s_%s.html' % (id,
                                                       json_criteria[id].replace('.', '-').replace('[', '').replace(']', ''),
                                                       id,
                                                       x + 1),
                   'test/fixtures/%s/%s-%s_%s.html' % (dir,
                                                       json_criteria[dir].replace('.', '-').replace('[', '').replace(']', ''),
                                                       dir,
                                                       x + 1)
                   ) for x in range(number)]
        except:
            pass
        
        try:
            [copy ('test/fixtures/%s/%s-%s_%s.css' % (id,
                                                       json_criteria[id].replace('.', '-').replace('[', '').replace(']', ''),
                                                       id,
                                                       x + 1),
                   'test/fixtures/%s/%s-%s_%s.css' % (dir,
                                                       json_criteria[dir].replace('.', '-').replace('[', '').replace(']', ''),
                                                       dir,
                                                       x + 1)
                   ) for x in range(number)]
        except:
            pass

        try:
            [copy ('test/fixtures/%s/%s-%s_%s.json' % (id,
                                                       json_criteria[id].replace('.', '-').replace('[', '').replace(']', ''),
                                                       id,
                                                       x + 2),
                   'test/fixtures/%s/%s-%s_%s.json' % (dir,
                                                       json_criteria[dir].replace('.', '-').replace('[', '').replace(']', ''),
                                                       dir,
                                                       x + 2)
                   ) for x in range(number)]
        except:
            pass
