# huayra-quotes-data

Este repositorio se usa junto a huayra-quotes.

## Pasos de integración


Primero necesitás tener clonados este repositorio y huayra-quotes, las dos copias
de trabajo tienen que quedar en el mismo nivel de directorios.

Por ejemplo, podrías clonar los dos repositorios así:

```
git clone git@github.com:HuayraLinux/huayra-quotes.git
git clone git@github.com:HuayraLinux/huayra-quotes-data.git
```

luego, dentro del directorio `huayra-quotes-data` ejecutar el comando make:

```
cd huayra-quotes-data
make
```

Uno de los comandos principales es el comando ``make full`` que se encarga de
descargar por completo la base de datos de frases de wikimedia, y luego procesa
la descarga para importarla en la aplicación huayra-quotes. Los archivos resultarntes
van a quedar en ``../huayra-quotes/``


