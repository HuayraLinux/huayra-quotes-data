N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m

all: download clear_data import copy_data


download:
	rm -r -f eswikiquote-20150406-pages-articles.xml.bz2
	wget https://dumps.wikimedia.org/eswikiquote/20150406/eswikiquote-20150406-pages-articles.xml.bz2
	rm -r -f eswikiquote-20150406-pages-articles.xml
	bzip2 -d eswikiquote-20150406-pages-articles.xml.bz2

import:
	@echo "${G}Ejecutando el importador ...${N}"
	@node importador.js

copy_data:
	@echo "${G}Copiando archivos data en ../huayra-quotes/data${N}"
	@rm -r -f ../huayra-quotes/public/data
	@cp -r -f data ../huayra-quotes/public/data

clear_data:
	@echo "${G}Limpiando el directorio data${N}"
	@rm -r -f data
	@mkdir data
	@touch data/.gitkeep
