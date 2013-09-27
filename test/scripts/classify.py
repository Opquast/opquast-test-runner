from json import load, dump, dumps

sets = {}
json_sets = load(open('data/rulesets.json'))

for key, value in json_sets.items():
    if key in ['TABLE', 'FORM', 'LIST', 'IMG']:
        continue

    val = dumps(value)
    try:
        sets[val].append(key)
    except:
        sets[val] = []
        sets[val].append(key)

i = 1

for key, value in sets.items():
    sets[i] = sets[key]
    del(sets[key])
    i += 1

dump(sets, open('bps.json', 'w'))
