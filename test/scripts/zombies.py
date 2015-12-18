from csv import reader
from os import listdir, getcwd
from os.path import join
from shutil import move

from paths import *


ids = []

with open(join(getcwd(), 'test/scripts/criteria.csv'), 'r') as csv_file:
    for row in reader(csv_file, delimiter=','):
        ids.append(row[3])

print 'SETS'
for id in listdir(join(getcwd(), sets_path)):
    if id not in ids:
        print id
        move(join(getcwd(), sets_path, id), join(getcwd(), sets_zombies_path, id))

print 'DEBUG'
for id in listdir(join(getcwd(), sets_debug_path)):
    if id not in ids:
        print id
        move(join(getcwd(), sets_debug_path, id), join(getcwd(), sets_zombies_path, id))

print 'IMPOSSIBLE'
for id in listdir(join(getcwd(), sets_impossible_path)):
    if id not in ids:
        print id
        move(join(getcwd(), sets_impossible_path, id), join(getcwd(), sets_zombies_path, id))
