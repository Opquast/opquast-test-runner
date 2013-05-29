from os import listdir, rename

path = './test/fixtures/rename/'

for dir in listdir(path):
#     for file in listdir(path + dir):
#         rename(path + dir + '/' + file, path + dir + '/' + file.replace('_', '-', 1))
     dst = listdir(path + dir)[0].split('_')[0].split('-')[-1]
     rename(path + dir, path + dst)