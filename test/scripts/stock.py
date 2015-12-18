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
   'CG62.csv',
   'CharteAquitaine2010.csv',
   'Demo.csv',
   'INSEE.csv',
   'UNPIDF.csv',
   'MobileOK.csv',
   'Renow1.5.csv',
]

for file in files:
    with open(join(getcwd(), 'test/scripts/csv', file), 'r') as csv_file:
        for row in reader(csv_file, delimiter=','):
            ids.append(row[0])

for id in ids:
    if exists(join(getcwd(), sets_path, id)):
        print "%s : sets -> stock" % id
        move(join(getcwd(), sets_path, id), join(getcwd(), sets_stock_path, id))
        json_sets_stock[id] = json_sets[id]
        del json_sets[id]
    elif exists(join(getcwd(), sets_debug_path, id)):
        print "%s : debug -> stock" % id
        move(join(getcwd(), sets_debug_path, id), join(getcwd(), sets_stock_path, id))
        json_sets_stock[id] = json_sets[id]
        del json_sets[id]
    elif exists(join(getcwd(), sets_impossible_path, id)):
        print "%s : impossible -> stock" % id
        move(join(getcwd(), sets_impossible_path, id), join(getcwd(), sets_stock_path, id))
        json_sets_stock[id] = json_sets[id]
        del json_sets[id]

dump(json_sets, open(join(getcwd(), sets_json_path), 'w'))
dump(json_sets_stock, open(join(getcwd(), sets_stock_json_path), 'w'))
