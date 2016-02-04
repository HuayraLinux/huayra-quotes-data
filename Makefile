NOMBRE="huayra-quotes-data"

N=[0m
G=[01;32m
Y=[01;33m
B=[01;34m


comandos:
	@echo ""
	@echo "${B}Comandos disponibles para ${G}${NOMBRE}${N}"
	@echo ""
	@echo "  ${Y}Completo${N}"
	@echo ""
	@echo "    ${G}full${N}            Realiza todos los pasos."
	@echo ""
	@echo ""
	@echo "  ${Y}Pasos (en el orden que los ejecuta full)${N}"
	@echo ""
	@echo "    ${G}iniciar${N}         Instala dependencias."
	@echo "    ${G}clear_data${N}      Limpia archivos generados."
	@echo "    ${G}download${N}        Baja el dump de frases completo."
	@echo "    ${G}import${N}          Adapta el formato de las frases."
	@echo "    ${G}copy_data${N}       Copia todo el contenido de frases al visor."
	@echo ""



full: iniciar clear_data import copy_data

iniciar:
	@echo "${G}Instalando dependencias ...${N}"
	@npm install
	@make download

download:
	@rm -f *.xml.bz2
	@rm -f *.xml
	@echo "${G}Descargando quotes desde wikimedia ...${N}"
	curl -O "https://dumps.wikimedia.org/eswikiquote/latest/eswikiquote-latest-pages-articles.xml.bz2" -#
	bzip2 -d eswikiquote-latest-pages-articles.xml.bz2

import:
	@echo "${G}Ejecutando el importador ...${N}"
	@node importador.js

copy_data:
	@echo "${G}Copiando archivos data en ../huayra-quotes/public/data${N}"
	@echo "${G}  (ese directorio está en .gitignore)${N}"
	@rm -r -f ../huayra-quotes/public/data
	@cp -r -f data ../huayra-quotes/public/data

clear_data:
	@echo "${G}Limpiando el directorio data${N}"
	@rm -r -f data
	@mkdir data
	@touch data/.gitkeep
