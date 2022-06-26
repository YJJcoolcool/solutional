import re
a = input("Paste text to process:")
a = a.replace('\n',' ') # Replace newline
a = re.sub(r'\(\d+ (mark|marks)\)','',a)
question = a.split("A.")[0].strip()
print(question)
optionletters = ['A.','B.','C.','D.','E.','F.','G.']
optionsList = []
b = a.split("A.")[1].strip()

# Take out the options
for i in optionletters:
    if i in b:
        option = b.split(i)[0].strip()
        b = b.split(i)[1].strip()
        optionsList.append(option)
        last = i
optionsList.append(b)

# Convert to JSON
optionsJSON=""
for i in optionsList:
    if i!=optionsList[-1]:
        optionsJSON+='\n\t\t"'+i+'",'
    else:
        optionsJSON+='\n\t\t"'+i+'"'

print("\nResult:")
format='{\n\t"question": "<question>",\n\t"type": 1,\n\t"options": [<options>\n\t]\n}'
result = format.replace("<question>",question)
result = result.replace("<options>",optionsJSON)
print(result)