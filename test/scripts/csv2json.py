# -*- coding:utf-8 -*-

from csv import reader
from json import dump
from os import getcwd
from os.path import join


csv_file = '728-Renow3.5.csv'
id = 716
json_fr = {}
json_en = {}

with open(join(getcwd(), 'test/scripts', csv_file), 'r') as fp:
    # skip 2 lines
    next(fp)
    next(fp)

    for row in reader(fp, delimiter=','):
        json_fr[row[0].strip()] = {
            'goal':row[6].strip(),
            'checklist':{
                 'id':id,
                 'name': u'Renow 3.5'
            },
            'explanation':'',
            'description':row[3].strip(),
            'solution':row[4].strip(),
            'thema':row[13].strip(),
            'name':row[2].strip()
        }
#         json_en[row[0].strip()] = {
#             'goal':row[11].strip(),
#             'checklist':{
#                  'id':id,
#                  'name': u'RGAA V3'
#             },
#             'explanation':'',
#             'description':row[8].strip(),
#             'solution':row[9].strip(),
#             'thema':row[13].strip(),
#             'name':row[7].strip()
#         }

dump(json_fr, open(join(getcwd(), 'test/scripts', '.'.join(csv_file.split('.')[:-1]) + '.%s.fr.json' % id), 'w'))
# dump(json_en, open(join(getcwd(), 'test/scripts', '.'.join(csv_file.split('.')[:-1]) + '.%s.en.json' % id), 'w'))
