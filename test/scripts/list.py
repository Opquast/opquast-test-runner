from json import load
from os import listdir, getcwd
from os.path import exists, join

rules_json_path = 'data/rules.json'
rules_json = load(open(rules_json_path)).keys()
rules_stock_json_path = 'test/rules-stock.json'
rules_stock_json = load(open(rules_stock_json_path)).keys()

rules_path = 'test/fixtures/rules/'
rules_debug_path = 'test/fixtures/rules-debug/'
rules_stock_path = 'test/fixtures/rules-stock/'

print 'DONE'
print 'rules in JSON and not in dir'

for rule in rules_json:
     if not exists(join(getcwd(), rules_path, rule) + '/') and not exists(join(getcwd(), rules_debug_path, rule) + '/'):
         print '\t' + rule

print 'rules in dir and not in JSON'
         
for dir in listdir(rules_path):
    if dir not in rules_json:
        print '\t' + dir
        
print 'DEBUG'
print 'rules in dir and not in JSON'
         
for dir in listdir(rules_debug_path):
    if dir not in rules_json:
        print '\t' + dir

print 'STOCK'
print 'rules in JSON and not in dir'

for rule in rules_stock_json:
     if not exists(join(getcwd(), rules_stock_path, rule) + '/'):
         print '\t' + rule
         
print 'rules in dir and not in JSON'
         
for dir in listdir(rules_stock_path):
    if dir not in rules_stock_json:
        print '\t' + dir
        
rulesets_json_path = 'data/rulesets.json'
rulesets_json = load(open(rulesets_json_path)).keys()
rulesets_stock_json_path = 'test/rulesets-stock.json'
rulesets_stock_json = load(open(rulesets_stock_json_path)).keys()

rulesets_path = 'test/fixtures/rulesets/'
rulesets_debug_path = 'test/fixtures/rulesets-debug/'
rulesets_stock_path = 'test/fixtures/rulesets-stock/'

print 'DONE'
print 'rulesets in JSON and not in dir'

for rule in rulesets_json:
     if not exists(join(getcwd(), rulesets_path, rule) + '/') and not exists(join(getcwd(), rulesets_debug_path, rule) + '/'):
         print '\t' + rule

print 'rulesets in dir and not in JSON'
         
for dir in listdir(rulesets_path):
    if dir not in rulesets_json:
        print '\t' + dir
        
print 'DEBUG'
print 'rulesets in dir and not in JSON'
         
for dir in listdir(rulesets_debug_path):
    if dir not in rulesets_json:
        print '\t' + dir
        
print 'STOCK'
print 'rulesets in JSON and not in dir'

for rule in rulesets_stock_json:
     if not exists(join(getcwd(), rulesets_stock_path, rule) + '/'):
         print '\t' + rule
         
print 'rulesets in dir and not in JSON'
         
for dir in listdir(rulesets_stock_path):
    if dir not in rulesets_stock_json:
        print '\t' + dir
