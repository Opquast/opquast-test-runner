from json import load, dumps
from os import getcwd, mkdir
from os.path import exists, join
from shutil import move

sets = {}
json_sets = load(open('data/rulesets.json'))
json_criteria = load(open('test/scripts/criteria.json'))

for key, value in json_sets.items():
    if key in ['TABLE', 'FORM', 'LIST', 'IMG']:
        continue
    
    val = dumps(value)
    try:
        sets[val].append(key)
    except:
        sets[val] = []
        sets[val].append(key)

for key, value in sets.items():
    if len(value) > 4:
        todo = False
        for val in value:
            if not exists(join(getcwd(), 'test/fixtures/rulesets/', val) + '/') and \
                    not exists(join(getcwd(), 'test/fixtures/rulesets-debug/', val) + '/') and \
                    not exists(join(getcwd(), 'test/fixtures/rulesets-stock/', val) + '/'):
                todo = True
            
        if todo:
            for val in value:
                if exists(join(getcwd(), 'test/fixtures/rulesets/', val) + '/'):
                    move(join(getcwd(), 'test/fixtures/rulesets/', val), join(getcwd(), 'test/fixtures/'))
                elif exists(join(getcwd(), 'test/fixtures/rulesets-debug/', val) + '/'):
                    move(join(getcwd(), 'test/fixtures/rulesets-debug/', val), join(getcwd(), 'test/fixtures/'))
                elif exists(join(getcwd(), 'test/fixtures/rulesets-stock/', val) + '/'):
                    move(join(getcwd(), 'test/fixtures/rulesets-stock/', val), join(getcwd(), 'test/fixtures/'))
                else:
                    mkdir(join('test/fixtures/', val))
                    name = json_criteria[val].replace('.', '-').replace('[', '').replace(']', '') + '-' + str(val)
                    open(join(getcwd(), 'test/fixtures/', val, name + '_1.html'), 'w').close()
                    open(join(getcwd(), 'test/fixtures/', val, name + '_2.html'), 'w').close()
            break