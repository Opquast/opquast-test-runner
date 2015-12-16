from json import load, dumps
from os import getcwd
from os.path import exists, join
from shutil import copytree

from paths import *


sets = {}
json_sets = load(open(sets_json_path))

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
    ok = []
    ko = []
    types = []

    for v in value:
        if exists(join(getcwd(), sets_path, v)):
            ok.append(v)
            types.append('N')
        elif exists(join(getcwd(), sets_debug_path, v)):
            ok.append(v)
            types.append('D')
        elif exists(join(getcwd(), sets_impossible_path, v)):
            ok.append(v)
            types.append('I')
        else:
            ko.append(v)

    if len(ok) and len(ko):
        types = set(types)

        print types
        print "%s => %s" % (ok, ko)

        for dir in ko:
            if len(types) > 1:
                print 'mix'
            elif types == set(['N']):
                copytree(join(getcwd(), sets_path, ok[0]), join(getcwd(), sets_path, dir))
            elif types == set(['D']):
                copytree(join(getcwd(), sets_debug_path, ok[0]), join(getcwd(), sets_debug_path, dir))
            elif types == set(['I']):
                copytree(join(getcwd(), sets_impossible_path, ok[0]), join(getcwd(), sets_impossible_path, dir))
