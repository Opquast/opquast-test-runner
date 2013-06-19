from json import load
from os import listdir, getcwd
from os.path import exists, join

rules_path = 'test/fixtures/rules/'
rules_debug_path = 'test/fixtures/rules-debug/'
rules_stock_path = 'test/fixtures/rules-stock/'

print 'DONE'
for dir in listdir(rules_path):
    if exists(join(getcwd(), rules_debug_path, dir) + '/'):
        print '\t' + dir + ' exists in debug'
    if exists(join(getcwd(), rules_stock_path, dir) + '/'):
        print '\t' + dir + ' exists in stock'
        
print 'DEBUG'
for dir in listdir(rules_debug_path):
    if exists(join(getcwd(), rules_path, dir) + '/'):
        print '\t' + dir + ' exists in done'
    if exists(join(getcwd(), rules_stock_path, dir) + '/'):
        print '\t' + dir + ' exists in stock'

print 'STOCK'
for dir in listdir(rules_stock_path):
    if exists(join(getcwd(), rules_path, dir) + '/'):
        print '\t' + dir + ' exists in done'
    if exists(join(getcwd(), rules_debug_path, dir) + '/'):
        print '\t' + dir + ' exists in debug'
        
rulesets_path = 'test/fixtures/rulesets/'
rulesets_debug_path = 'test/fixtures/rulesets-debug/'
rulesets_stock_path = 'test/fixtures/rulesets-stock/'

print 'DONE'
for dir in listdir(rulesets_path):
    if exists(join(getcwd(), rulesets_debug_path, dir) + '/'):
        print '\t' + dir + ' exists in debug'
    if exists(join(getcwd(), rulesets_stock_path, dir) + '/'):
        print '\t' + dir + ' exists in stock'
        
print 'DEBUG'
for dir in listdir(rulesets_debug_path):
    if exists(join(getcwd(), rulesets_path, dir) + '/'):
        print '\t' + dir + ' exists in done'
    if exists(join(getcwd(), rulesets_stock_path, dir) + '/'):
        print '\t' + dir + ' exists in stock'

print 'STOCK'
for dir in listdir(rulesets_stock_path):
    if exists(join(getcwd(), rulesets_path, dir) + '/'):
        print '\t' + dir + ' exists in done'
    if exists(join(getcwd(), rulesets_debug_path, dir) + '/'):
        print '\t' + dir + ' exists in debug'