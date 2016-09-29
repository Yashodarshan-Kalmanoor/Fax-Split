import sys 
import os
import warnings
import json
import PyPDF2
warnings.filterwarnings('ignore', '.*not zero-indexed.*',)
json_input = sys.argv[1] #value1
decoded = json.loads(json_input)
arg1 = str(decoded['attachmentId']) + '.pdf'#get the attachment id
pages = decoded['pdftocreate']
pdf1File = open(arg1, 'rb')
try:
    pdf1Reader = PyPDF2.PdfFileReader(pdf1File)
    pdfWriter = PyPDF2.PdfFileWriter()
    for pageNum in range(pages):
        output = PyPDF2.PdfFileWriter()
        pagesplits = decoded['pagesplits'][int(pageNum)]['pages']
        for page in pagesplits.split(','):
            output.addPage(pdf1Reader.getPage(int(page)))
        newname = str(arg1) + str(pageNum) + "split.pdf"  
        outputStream = file(newname, "wb")
        output.write(outputStream)
        outputStream.close()
except IOError:
        print('cannot open', arg)
#os.remove(arg1)  

# Code to split pages of 2
# for pageNum in range(pdf1Reader.numPages):
#         output = PyPDF2.PdfFileWriter()
        
#         if pageNum * 2 + 1 >  pdf1Reader.numPages:
#             print pageNum * 2 + 1
#             break
            
#         output.addPage(pdf1Reader.getPage(pageNum * 2))

#         if pageNum * 2 + 1 <  pdf1Reader.numPages:
#             output.addPage(pdf1Reader.getPage(pageNum * 2 + 1))

#         newname = str(arg1) + str(pageNum) + "split.pdf"

#         outputStream = file(newname, "wb")
#         output.write(outputStream)
#         outputStream.close()

