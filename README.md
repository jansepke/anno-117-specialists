# Anno 117 items

View and filter all Items of Anno 117. Access it here: [anno-117.jansepke.de](https://anno-117.jansepke.de/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

```bash
npm install   # install dependencies
npm run dev   # run development server
npm run build # create production build
```

## Update game data

1. download and start [RDA Explorer](https://github.com/lysannschlegel/RDAExplorer)
1. open lastest `.rda` file (e.g. `C:\Program Files (x86)\Ubisoft\Ubisoft Game Launcher\games\Anno 117\maindata\data31.rda`)
1. extract `data/config/export/main/asset/assets.xml`, `data/config/gui/texts_english.xml` and `data/config/gui/texts_german.xml`
1. copy files to the `./import-data/xml` folder
1. run `npm run xml-to-json`
1. run `npm run fill-db`

## TODO

- filter
- favourites
- captain items
- footer
- info texts
- husky
- link between 1800 / 117 apps

## License

[MIT](https://choosealicense.com/licenses/mit/)
