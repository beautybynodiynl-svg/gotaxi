// Vaste diensten van GoTaxiUtrecht. Dit zijn er bewust maar drie — geen losse
// database-tabel zoals bij de werkgebieden, omdat dit de kernaanbod is dat niet
// dagelijks verandert. Pas de teksten hier aan als het aanbod wijzigt.

export const SERVICES = [
  {
    slug: "schiphol-taxi",
    name: "Schiphol Taxi",
    shortText: "Op tijd naar Schiphol, Eindhoven of Rotterdam Airport. We houden je vluchttijd in de gaten, ook bij vertragingen.",
    heroTitle: "Luchthavenvervoer vanuit Utrecht, zonder stress",
    heroSubtitle: "Of je nu vroeg in de ochtend naar Schiphol moet of laat op de avond terugkomt: GoTaxiUtrecht brengt je rustig en op tijd naar de luchthaven, en haalt je ook weer op.",
    intro: "Een vlucht halen begint met een goede planning — en dat geldt ook voor het vervoer ernaartoe. Bij GoTaxiUtrecht reken je niet meer zelf uit hoe laat je moet vertrekken om de spits en eventuele vertraging voor te zijn. Wij kennen de route, houden het verkeer in de gaten, en zorgen dat je ruim op tijd bent inclusief tijd om in te checken.",
    forWho: [
      "Reizigers die vanuit Utrecht en omgeving naar Schiphol, Eindhoven Airport of Rotterdam The Hague Airport moeten",
      "Zakelijke reizigers die niet willen puzzelen met parkeren en langeafstandstreinen",
      "Gezinnen met veel bagage, die liever niet overstappen met koffers",
      "Iedereen met een vroege ochtendvlucht of een late nachtvlucht",
    ],
    whatToExpect: [
      "We houden je vluchttijd in de gaten — bij vertraging passen we het ophaalmoment automatisch aan",
      "Ruime bagageruimte, ook voor meerdere koffers of een kinderwagen",
      "Vaste prijs mogelijk voor de bekendste routes, zodat je vooraf weet waar je aan toe bent",
      "Ophalen bij je voordeur, geen gedoe met parkeren of lange looproutes",
      "Ook 's nachts en in het weekend beschikbaar",
    ],
    faqs: [
      {
        q: "Hoe ver van tevoren moet ik boeken?",
        a: "Hoe eerder, hoe beter — zeker bij vroege ochtendvluchten. Bel of app ons gerust ook op korte termijn, we proberen altijd een oplossing te vinden.",
      },
      {
        q: "Wat als mijn vlucht vertraging heeft bij thuiskomst?",
        a: "Geef ons je vluchtnummer door, dan houden we de actuele aankomsttijd in de gaten en passen we het ophaalmoment daarop aan.",
      },
      {
        q: "Kan ik een vaste prijs afspreken?",
        a: "Voor vaste routes, zoals Utrecht Centrum naar Schiphol, kun je vooraf een vaste prijs opvragen. Bel of app ons voor de mogelijkheden.",
      },
    ],
  },
  {
    slug: "zakelijk-vervoer",
    name: "Zakelijk vervoer",
    shortText: "Betrouwbaar vervoer voor klantbezoeken, personeel of stationsritten — desgewenst met factuur voor je bedrijf.",
    heroTitle: "Zakelijk vervoer waar je op kunt bouwen",
    heroSubtitle: "Stiptheid en betrouwbaarheid zijn niet onderhandelbaar als het om zaken gaat. GoTaxiUtrecht verzorgt vervoer voor bedrijven in en rond Utrecht, van eenmalige ritten tot vaste afspraken.",
    intro: "Een gemiste aansluiting of een chauffeur die de weg niet kent, kost tijd — en tijd is in het zakenleven geld. GoTaxiUtrecht rijdt al jaren in de regio Utrecht en kent de snelste routes naar kantoorlocaties, stations en beursterreinen. Of het nu gaat om een enkele rit voor een klantbezoek of doorlopend vervoer voor je personeel, we denken graag mee over wat het beste bij jouw bedrijf past.",
    forWho: [
      "Bedrijven die klanten of relaties ophalen van het station of de luchthaven",
      "Medewerkers die tussen kantoorlocaties in de regio moeten reizen",
      "Organisaties die vervoer regelen voor beurzen, congressen of evenementen",
      "Bedrijven die op zoek zijn naar een vaste, betrouwbare vervoerspartner",
    ],
    whatToExpect: [
      "Facturatie mogelijk, zodat je niet met bonnetjes hoeft te schuiven",
      "Nette, representatieve auto's en chauffeurs die weten hoe ze met zakelijke klanten omgaan",
      "Vaste afspraken en terugkerende ritten zijn bespreekbaar",
      "Discretie voor gesprekken tijdens de rit",
      "Snel te boeken, ook op de dag zelf",
    ],
    faqs: [
      {
        q: "Kunnen jullie facturen sturen in plaats van per rit afrekenen?",
        a: "Ja, voor bedrijven is facturatie mogelijk. Neem contact op om de mogelijkheden te bespreken.",
      },
      {
        q: "Regelen jullie ook vervoer voor een hele groep, bijvoorbeeld bij een congres?",
        a: "Dat kan, mits je dit van tevoren met ons afstemt zodat we voldoende auto's kunnen inplannen.",
      },
      {
        q: "Is een vaste chauffeur voor terugkerende ritten mogelijk?",
        a: "In veel gevallen wel — laat het ons weten als dit voor jouw situatie belangrijk is, dan kijken we wat we kunnen regelen.",
      },
    ],
  },
  {
    slug: "dagelijks-vervoer",
    name: "Dagelijks vervoer",
    shortText: "Naar het station, een avondje uit, of gewoon boodschappen die te zwaar zijn voor de fiets. Bel en we komen eraan.",
    heroTitle: "Voor elke dag dat je even niet zelf hoeft te rijden",
    heroSubtitle: "Niet elke rit heeft een aanleiding nodig. Naar het station, een avondje stappen, of gewoon een keer niet met de fiets in de regen — GoTaxiUtrecht is er voor de dagelijkse ritjes in en rond Utrecht.",
    intro: "De meeste taxiritten zijn helemaal niet bijzonder — en dat is precies waar wij goed in zijn. Snel een taxi nodig zonder poespas, tegen een eerlijke prijs, met een chauffeur die de stad en de regio kent. Van een ritje naar Utrecht Centraal tot een avondje uit met vrienden: bel of app ons, en we staan voor de deur.",
    forWho: [
      "Iedereen die naar het station, een afspraak of een avondje uit moet",
      "Mensen die liever niet zelf rijden na een avondje stappen",
      "Ouderen of mensen die minder mobiel zijn en op deur-tot-deurvervoer zijn aangewezen",
      "Wie een keer geen fiets of auto tot zijn beschikking heeft",
    ],
    whatToExpect: [
      "Meestal snel ter plaatse, ook op korte termijn",
      "Taxameter of, voor vaste routes, een prijsafspraak vooraf",
      "Dag en nacht bereikbaar, ook in het weekend",
      "Pinnen of contant betalen, altijd een bonnetje",
      "Vriendelijke chauffeurs die de regio door en door kennen",
    ],
    faqs: [
      {
        q: "Kan ik ook zonder reservering meteen een taxi bestellen?",
        a: "Ja, bel of app ons en we plannen direct een rit voor je in — vaak sta je binnen enkele minuten voor de deur.",
      },
      {
        q: "Rijden jullie ook 's nachts?",
        a: "Zeker, GoTaxiUtrecht is 24 uur per dag, 7 dagen per week bereikbaar.",
      },
      {
        q: "Wat kost een ritje binnen Utrecht ongeveer?",
        a: "Dat hangt af van afstand en tijdstip, we rekenen standaard op de taxameter. Bel gerust voor een inschatting vooraf.",
      },
    ],
  },
];

export function getService(slug) {
  return SERVICES.find((s) => s.slug === slug) || null;
}
