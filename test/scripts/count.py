from json import load

from paths import *


print str(len(load(open(rules_json_path)).keys())) + ' regles'
print str(len(load(open(rules_stock_json_path)).keys())) + ' regles en stock'

print str(len(load(open(sets_json_path)).keys())) + ' BP'
print str(len(load(open(sets_stock_json_path)).keys())) + ' BP en stock'

print set(load(open(rules_json_path)).keys()) - set(load(open(rules_test_json_path)).keys())

print set(load(open(rules_test_json_path)).keys()) - set(load(open(rules_json_path)).keys())

