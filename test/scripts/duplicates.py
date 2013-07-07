from json import load
from os import listdir, getcwd
from os.path import exists, join

rules_path = 'test/fixtures/rules/'
rules_debug_path = 'test/fixtures/rules-debug/'
rules_impossible_path = 'test/fixtures/rules-impossible/'
rules_stock_path = 'test/fixtures/rules-stock/'

print 'RULES'

print '\tDONE'
for dir in listdir(rules_path):
    if exists(join(getcwd(), rules_debug_path, dir) + '/'):
        print '\t\t' + dir + ' exists in debug'
    if exists(join(getcwd(), rules_impossible_path, dir) + '/'):
        print '\t\t' + dir + ' exists in impossible'
    if exists(join(getcwd(), rules_stock_path, dir) + '/'):
        print '\t\t' + dir + ' exists in stock'
        
print '\tDEBUG'
for dir in listdir(rules_debug_path):
    if exists(join(getcwd(), rules_path, dir) + '/'):
        print '\t\t' + dir + ' exists in done'
    if exists(join(getcwd(), rules_impossible_path, dir) + '/'):
        print '\t\t' + dir + ' exists in impossible'
    if exists(join(getcwd(), rules_stock_path, dir) + '/'):
        print '\t\t' + dir + ' exists in stock'

print '\tIMPOSSIBLE'
for dir in listdir(rules_impossible_path):
    if exists(join(getcwd(), rules_path, dir) + '/'):
        print '\t\t' + dir + ' exists in done'
    if exists(join(getcwd(), rules_debug_path, dir) + '/'):
        print '\t\t' + dir + ' exists in debug'
    if exists(join(getcwd(), rules_stock_path, dir) + '/'):
        print '\t\t' + dir + ' exists in stock'

print '\tSTOCK'
for dir in listdir(rules_stock_path):
    if exists(join(getcwd(), rules_path, dir) + '/'):
        print '\t\t' + dir + ' exists in done'
    if exists(join(getcwd(), rules_debug_path, dir) + '/'):
        print '\t\t' + dir + ' exists in debug'
    if exists(join(getcwd(), rules_impossible_path, dir) + '/'):
        print '\t\t' + dir + ' exists in impossible'
        
sets_path = 'test/fixtures/sets/'
sets_debug_path = 'test/fixtures/sets-debug/'
sets_impossible_path = 'test/fixtures/sets-impossible/'
sets_stock_path = 'test/fixtures/sets-stock/'

print 'SETS'

print '\tDONE'
for dir in listdir(sets_path):
    if exists(join(getcwd(), sets_debug_path, dir) + '/'):
        print '\t\t' + dir + ' exists in debug'
    if exists(join(getcwd(), sets_impossible_path, dir) + '/'):
        print '\t\t' + dir + ' exists in impossible'
    if exists(join(getcwd(), sets_stock_path, dir) + '/'):
        print '\t\t' + dir + ' exists in stock'
        
print '\tDEBUG'
for dir in listdir(sets_debug_path):
    if exists(join(getcwd(), sets_path, dir) + '/'):
        print '\t\t' + dir + ' exists in done'
    if exists(join(getcwd(), sets_impossible_path, dir) + '/'):
        print '\t\t' + dir + ' exists in impossible'
    if exists(join(getcwd(), sets_stock_path, dir) + '/'):
        print '\t\t' + dir + ' exists in stock'

print '\tIMPOSSIBLE'
for dir in listdir(sets_impossible_path):
    if exists(join(getcwd(), sets_path, dir) + '/'):
        print '\t\t' + dir + ' exists in done'
    if exists(join(getcwd(), sets_debug_path, dir) + '/'):
        print '\t\t' + dir + ' exists in debug'
    if exists(join(getcwd(), sets_stock_path, dir) + '/'):
        print '\t\t' + dir + ' exists in stock'

print '\tSTOCK'
for dir in listdir(sets_stock_path):
    if exists(join(getcwd(), sets_path, dir) + '/'):
        print '\t\t' + dir + ' exists in done'
    if exists(join(getcwd(), sets_debug_path, dir) + '/'):
        print '\t\t' + dir + ' exists in debug'
    if exists(join(getcwd(), sets_impossible_path, dir) + '/'):
        print '\t\t' + dir + ' exists in impossible'