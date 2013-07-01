from json import load
from os import listdir, getcwd
from os.path import exists, join

fixtures_path = 'test/fixtures/'

rules_json_path = 'data/rules.json'
rules_json = load(open(rules_json_path)).keys()
rules_stock_json_path = 'test/rules-stock.json'
rules_stock_json = load(open(rules_stock_json_path)).keys()

rules_path = 'test/fixtures/rules/'
rules_debug_path = 'test/fixtures/rules-debug/'
rules_stock_path = 'test/fixtures/rules-stock/'

print 'RULES'
print '\tDONE'
print '\t\trules in JSON and not in dir'

for rule in rules_json:
     if not exists(join(getcwd(), rules_path, rule) + '/') and not exists(join(getcwd(), rules_debug_path, rule) + '/'):
         print '\t\t\t' + rule

print '\t\trules in dir and not in JSON'
         
for dir in listdir(rules_path):
    if dir not in rules_json:
        print '\t\t\t' + dir
        
print '\tDEBUG'
print '\t\trules in dir and not in JSON'
         
for dir in listdir(rules_debug_path):
    if dir not in rules_json:
        print '\t\t\t' + dir

print '\tSTOCK'
print '\t\trules in JSON and not in dir'

for rule in rules_stock_json:
     if not exists(join(getcwd(), rules_stock_path, rule) + '/'):
         print '\t\t\t' + rule
         
print '\t\trules in dir and not in JSON'
         
for dir in listdir(rules_stock_path):
    if dir not in rules_stock_json:
        print '\t\t\t' + dir
        
sets_json_path = 'data/rulesets.json'
sets_json = load(open(sets_json_path)).keys()
sets_stock_json_path = 'test/sets-stock.json'
sets_stock_json = load(open(sets_stock_json_path)).keys()

sets_path = 'test/fixtures/sets/'
sets_debug_path = 'test/fixtures/sets-debug/'
sets_impossible_path = 'test/fixtures/sets-impossible/'
sets_stock_path = 'test/fixtures/sets-stock/'

print 'SETS'
print '\tDONE'
print '\t\tsets in JSON and not in dir'

for rule in sets_json:
    if not exists(join(getcwd(), sets_path, rule) + '/') and not exists(join(getcwd(), sets_debug_path, rule) + '/') \
            and not exists(join(getcwd(), sets_impossible_path, rule) + '/') \
            and rule not in ('FORM', 'LIST', 'TABLE', 'IMG'):
        print '\t\t\t' + rule
    if exists(join(getcwd(), sets_stock_path, rule) + '/'):
        print '\t\t\t\tin stock'

print '\t\tsets in dir and not in JSON'
         
for dir in listdir(sets_path):
    if dir not in sets_json:
        print '\t\t\t' + dir
        
print '\tDEBUG'
print '\t\tsets in dir and not in JSON'
         
for dir in listdir(sets_debug_path):
    if dir not in sets_json:
        print '\t\t\t' + dir
        
print '\tSTOCK'
print '\t\tsets in JSON and not in dir'

for rule in sets_stock_json:
     if not exists(join(getcwd(), sets_stock_path, rule) + '/'):
         print '\t\t\t' + rule
         
print '\t\tsets in dir and not in JSON'
         
for dir in listdir(sets_stock_path):
    if dir not in sets_stock_json:
        print '\t\t\t' + dir
