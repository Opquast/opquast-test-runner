from json import load
from os import listdir, getcwd
from os.path import exists, join

rules_path = 'test/fixtures/rules/'
rules_debug_path = 'test/fixtures/rules-debug/'
rules_stock_path = 'test/fixtures/rules-stock/'
rules_json_path = 'data/rules.json'

rulesets_path = 'test/fixtures/rulesets/'
rulesets_debug_path = 'test/fixtures/rulesets-debug/'
rulesets_stock_path = 'test/fixtures/rulesets-stock/'
rulesets_json_path = 'data/rulesets.json'
rulesets_json_debug_path = 'test/rulesets-debug.json'

rules_json = load(open(rules_json_path)).keys()
rulesets_json = load(open(rulesets_json_path)).keys()
rulesets_json_debug = load(open(rulesets_json_debug_path)).keys()
rulesets_json += rulesets_json_debug

print 'rules'
for rule in rules_json:
     if not exists(join(getcwd(), rules_path, rule) + '/') and not exists(join(getcwd(), rules_debug_path, rule) + '/') and not exists(join(getcwd(), rules_stock_path, rule) + '/'):
         print '\t' + rule
  
# print 'rulesets'
# for ruleset in rulesets_json:
#      if not exists(join(getcwd(), rulesets_path, ruleset) + '/') and not exists(join(getcwd(), rulesets_debug_path, ruleset) + '/') and not exists(join(getcwd(), rulesets_stock_path, ruleset) + '/'):
#          print '\t' + ruleset
 
print 'rules done'
for dir in listdir(rules_path):
    if dir not in rules_json:
        print '\t' + dir
         
print 'rules debug'
for dir in listdir(rules_debug_path):
    if dir not in rules_json:
        print '\t' + dir
         
print 'rules stock'
for dir in listdir(rules_stock_path):
    if dir not in rules_json:
        print '\t' + dir
 
print 'rulesets done'
for dir in listdir(rulesets_path):
    if dir not in rulesets_json:
        print '\t' + dir
         
# print 'rulesets debug'
# for dir in listdir(rulesets_debug_path):
#     if dir not in rulesets_json:
#          print '\t' + dir
          
# print 'rulesets stock'
# for dir in listdir(rulesets_stock_path):
#     if dir not in rulesets_json:
#         print '\t' + dir
