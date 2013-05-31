from json import load

rulesets_json_path = 'data/rulesets.json'
rulesets_json_debug_path = 'test/rulesets-debug.json'
rulesets_json_stock_path = 'test/rulesets-stock.json'

rulesets_json = load(open(rulesets_json_path)).keys()
rulesets_json += load(open(rulesets_json_debug_path)).keys()
rulesets_json = load(open(rulesets_json_stock_path)).keys()
rulesets_json.remove('TABLE')
rulesets_json.remove('FORM')
rulesets_json.remove('IMG')
rulesets_json.remove('LIST')

print 'SELECT id, name_fr, automated FROM checklists_checklist WHERE id IN (SELECT DISTINCT checklist_id FROM checklists_criterion WHERE id IN (' + str([str(x) for x in rulesets_json]).replace('[', '').replace(']', '') + '));'