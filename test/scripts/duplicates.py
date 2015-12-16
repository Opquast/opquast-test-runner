from json import load
from os import listdir, getcwd
from os.path import exists, join

from paths import *


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
