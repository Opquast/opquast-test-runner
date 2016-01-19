from csv import reader
from json import load
from os import listdir, getcwd
from os.path import join


keys = []

for dir in listdir('test/scripts/csv'):
    if dir.endswith('.csv'):
        with open(join(getcwd(), 'test/scripts/csv', dir), 'r') as csvfile:
            for row in reader(csvfile, delimiter=','):
                keys.append(row[0])

json_criteria = load(open(join(getcwd(), 'test/scripts', 'criteria.json')))

for key in json_criteria.keys():
    if key not in keys:
        print "%s => %s" % (key, json_criteria[key])
