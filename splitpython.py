import sys 
import os
#arg1 = sys.argv[1] #value1
 
import PyPDF2
pdf1File = open('SPIE.pdf', 'rb')
print pdf1File
pdf1Reader = PyPDF2.PdfFileReader(pdf1File)
pdfWriter = PyPDF2.PdfFileWriter()
for pageNum in range(pdf1Reader.numPages):
        output = PyPDF2.PdfFileWriter()
        
        if pageNum * 2 + 1 >  pdf1Reader.numPages:
            print pageNum * 2 + 1
            break
            
        output.addPage(pdf1Reader.getPage(pageNum * 2))
 
        if pageNum * 2 + 1 <  pdf1Reader.numPages:
            output.addPage(pdf1Reader.getPage(pageNum * 2 + 1))
 
        newname = str(pageNum) + ".pdf"
 
        outputStream = file(newname, "wb")
        output.write(outputStream)
        outputStream.close()
os.remove('SPIE.pdf')  
