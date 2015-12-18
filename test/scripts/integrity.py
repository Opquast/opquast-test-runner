# -*- coding: utf-8 -*-

from json import load
from os import listdir, getcwd
from os.path import join
from shutil import move
from sys import exc_info

from paths import *


rules = {
    'dir': [],
    'json': []
}

for rule in load(open(rules_json_path)):
    rules['json'].append(rule)

for dir in listdir(rules_path):
    rules['dir'].append(dir)

for dir in listdir(rules_debug_path):
    rules['dir'].append(dir)

for dir in listdir(rules_impossible_path):
    rules['dir'].append(dir)

rules_dir = set(rules['dir'])
rules_json = set(rules['json'])

print '----------------'
print "in json and not in dir"
print sorted(rules_json.difference(rules_dir))

print '----------------'
print "in dir and not in json"
print sorted(rules_dir.difference(rules_json))

rulesets = {
    'dir': [],
    'json': []
}

for ruleset in load(open(sets_json_path)):
    rulesets['json'].append(ruleset)

for dir in listdir(sets_path):
    rulesets['dir'].append(dir)

for dir in listdir(sets_debug_path):
    rulesets['dir'].append(dir)

for dir in listdir(sets_impossible_path):
    rulesets['dir'].append(dir)

rulesets_dir = set(rulesets['dir'])
rulesets_json = set(rulesets['json'])

print '----------------'
print "in json and not in dir"
print sorted(rulesets_json.difference(rulesets_dir))

print '----------------'
print "in dir and not in json"
print sorted(rulesets_dir.difference(rulesets_json))

json_criteria = load(open(join(getcwd(), 'test/scripts', 'criteria.json')))

print '----------------'
print 'SETS'
for id in listdir(join(getcwd(), sets_path)):
    for file in listdir(join(getcwd(), sets_path, id)):
        try:
            name = json_criteria[id].replace('[', '').replace(']', '').replace('.', '-').replace(' ', '').replace(u'É', 'E').replace(u'é', 'e').upper()
            _name = '-'.join(file.split('-')[:-1])
            _id = file.split('-')[-1].split('_')[0]

            if _name not in (name, '') or _id not in (id, ''):
                _file = '%s-%s_%s' % (name, id, file.split('_')[1])
                move(join(getcwd(), sets_path, id, file), join(getcwd(), sets_path, id, _file))

        except:
            print '\t\t%s (%s)' % (file, exc_info()[0])

print '----------------'
print 'DEBUG'
for id in listdir(join(getcwd(), sets_debug_path)):
    for file in listdir(join(getcwd(), sets_debug_path, id)):
        try:
            name = json_criteria[id].replace('[', '').replace(']', '').replace('.', '-').replace(' ', '').replace(u'É', 'E').replace(u'é', 'e').upper()
            _name = '-'.join(file.split('-')[:-1])
            _id = file.split('-')[-1].split('_')[0]

            if _name not in (name, '') or _id not in (id, ''):
                _file = '%s-%s_%s' % (name, id, file.split('_')[1])
                move(join(getcwd(), sets_debug_path, id, file), join(getcwd(), sets_debug_path, id, _file))

        except:
            print '\t\t%s (%s)' % (file, exc_info()[0])

# for dir in listdir(join(getcwd(), sets_debug_path)):
#     for file in listdir(join(getcwd(), sets_path, dir)):
#         if '.html' in file and dir not in file:
#             print "debug: %s <> %s" % (dir, file)
#
# for dir in listdir(join(getcwd(), sets_impossible_path)):
#     for file in listdir(join(getcwd(), sets_path, dir)):
#         if '.html' in file and dir not in file:
#             print "impossible: %s <> %s" % (dir, file)
