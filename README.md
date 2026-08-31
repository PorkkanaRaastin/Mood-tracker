# Mood-tracker
Koulutyönä toteutettu mieliala tracker- sovellus

## Toiminnallisuudet:

Etusivu- pääsy mieliala tracker ja päiväkirja sivuille. 

Mielialatracker - valitse päivämäärä, mieliala ja kuinka monta tuntia nukuit.
Kun painat "lähetä" nappia tallennetaan tiedot json serverille ja ohjelma hakee merkinnät sieltä
ja näyttää ne "viimeisimmät merkinnät" osiossa sivun oikealla puolella.

Päiväkirja - Valitse päivämäärä ja kirjoita päivän mietteet tekstikenttään. Valitse tekstikentän 
alta sen hetkinen fiiliksesi ja paina lähetä. Tiedot tallennetaan json serverille ja ohjelma hakee
tiedot sieltä ja näyttää sivun "viimeisimmät merkinnät" osiossa sivun oikealla puolella. Painamalla
"näytä lisää" näytetään kirjotettu teksti. Painamalla "sulje" tekstiosio suljetaan näkyvistä.

Kummaltakin sivulta voi poistaa merkinnät jolloin ne poistuvat myös json serveriltä.

Toimiva dark ja light theme joka kytketään päälle/pois headeristä kaikilla sivuilla. 

## Json Server - tietokannan käyttöönotto

## 1. Asennus

Navigoi git bashissa oikeaan kansioon ja suorita
```bash
npm install -g json-server
```
## 2. Käynnistys

Käynnistä palvelin projektin juuressa, jossa `db.json` sijaitsee:

```bash
json-server --watch db.json --port 3001
```
Palvelin käynnistyy osoitteeseen `http://localhost:3001`.

## Tekijät Rasmus Rautanen ja Niklas Jurvelin.