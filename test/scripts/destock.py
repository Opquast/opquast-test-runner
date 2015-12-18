from csv import reader
from json import load, dump
from os import listdir, getcwd
from os.path import exists, join
from shutil import move, copytree

from paths import *


json_sets = load(open(join(getcwd(), sets_json_path)))
json_sets_stock = load(open(join(getcwd(), sets_stock_json_path)))

ids = []
files = [
    'Renow2.5b.csv',
    'Renow2.6b.csv',
    'Renow2.7b.csv',
    'Renow2.8b.csv',
    'Renow3.csv',
    'Renow3.1.csv',
    'Renow3.2.csv',
    'Renow3.3.csv',
    'Renow3.4.csv',
]

for file in files:
    with open(join(getcwd(), 'test/scripts/csv', file), 'r') as csv_file:
        for row in reader(csv_file, delimiter=','):
            ids.append(row[0])

for id in ids:
    if exists(join(getcwd(), sets_stock_path, id)):
        print "%s : stock -> sets" % id
        move(join(getcwd(), sets_stock_path, id), join(getcwd(), sets_path, id))
        json_sets[id] = json_sets_stock[id]
        del json_sets_stock[id]

dump(json_sets, open(join(getcwd(), sets_json_path), 'w'))
dump(json_sets_stock, open(join(getcwd(), sets_stock_json_path), 'w'))
