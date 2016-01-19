from json import load
from os import listdir

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
