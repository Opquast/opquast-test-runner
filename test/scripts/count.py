from json import load

print str(len(load(open('data/rules.json')).keys())) + ' regles'

print str(len(load(open('test/rules-stock.json')).keys())) + ' regles en stock'

print str(len(load(open('data/rulesets.json')).keys())) + ' BP'

print str(len(load(open('test/rulesets-stock.json')).keys())) + ' BP en stock'

print set(load(open('data/rules.json')).keys()) - set(load(open('test/rulesets.json')).keys())

print set(load(open('test/rulesets.json')).keys()) - set(load(open('data/rules.json')).keys())

