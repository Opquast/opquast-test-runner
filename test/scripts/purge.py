from json import load

sets_json_path = 'data/sets.json'
sets_json_debug_path = 'test/sets-debug.json'
sets_json_stock_path = 'test/sets-stock.json'

sets_json = load(open(sets_json_path)).keys()
sets_json += load(open(sets_json_debug_path)).keys()
sets_json = load(open(sets_json_stock_path)).keys()
sets_json.remove('TABLE')
sets_json.remove('FORM')
sets_json.remove('IMG')
sets_json.remove('LIST')

print 'SELECT id, name_fr, automated FROM checklists_checklist WHERE id IN (SELECT DISTINCT checklist_id FROM checklists_criterion WHERE id IN (' + str([str(x) for x in sets_json]).replace('[', '').replace(']', '') + '));'