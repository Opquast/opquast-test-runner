# -*- coding:utf-8 -*-

from csv import reader
from json import dump
from os import getcwd
from os.path import join


csv_file = 'RGAA3.csv'
id = 716
json_fr = {}
json_en = {}

with open(join(getcwd(), 'test/scripts', csv_file), 'r') as fp:
    # skip 2 lines
    next(fp)
    next(fp)

    for row in reader(fp, delimiter=','):
        json_fr[row[0].strip()] = {
            'goal':row[5].strip(),
            'checklist':{
                 'id':id,
                 'name': u'RGAA V3'
            },
            'explanation':'',
            'description':row[2].strip(),
            'solution':row[3].strip(),
            'thema':row[12].strip(),
            'name':row[1].strip()
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
