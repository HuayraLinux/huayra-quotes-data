N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m

all: clear_data import copy_data

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
