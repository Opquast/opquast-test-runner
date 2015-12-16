from json import load, dump
from os import listdir, getcwd
from os.path import exists, join
from shutil import move, copytree

from paths import *


json_sets = load(open(join(getcwd(), sets_json_path)))
json_sets_stock = load(open(join(getcwd(), sets_json_stock_path)))

ids = []

for id in ids:
    if exists(join(getcwd(), sets_path, id)):
        print "%s : sets -> stock" % id
        move(join(getcwd(), sets_path, id), join(getcwd(), sets_stock_path, id))
        json_sets_stock[id] = json_sets[id]
    elif exists(join(getcwd(), sets_debug_path, id)):
        print "%s : debug -> stock" % id
        move(join(getcwd(), sets_debug_path, id), join(getcwd(), sets_stock_path, id))
        json_sets_stock[id] = json_sets[id]
    elif exists(join(getcwd(), sets_impossible_path, id)):
        print "%s : impossible -> stock" % id
        move(join(getcwd(), sets_impossible_path, id), join(getcwd(), sets_stock_path, id))
        json_sets_stock[id] = json_sets[id]

dump(json_sets_stock, open(join(getcwd(), sets_json_stock_path), 'w'))