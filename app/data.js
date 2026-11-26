// Data for the Republic of Arunaya — National Statistics Office.
// All figures are the Office's published estimates for the fictional
// Republic of Arunaya. Every figure carries its reference year and
// the publication it comes from; see methodology for the notes.

const NSO = {
  country: "Republic of Arunaya",
  office: "Arunaya National Statistics Office",
  short: "ANSO",
  currency: "ARU",
  updated: "26 November 2025",
  baseYear: 2025,
};

const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

// Annual series, 2016-2025. Sources: ANSO Statistical Yearbook 2025,
// National Accounts Q3 2025, Labour Force Survey Oct 2025, CPI Oct 2025.
const SERIES = {
  population: { label: "Population", unit: "million people", values: [44.10, 44.62, 45.03, 45.48, 45.91, 46.34, 46.81, 47.32, 47.78, 48.24], source: "Population Estimates 2025" },
  gdp: { label: "Gross domestic product", unit: "billion ARU, current prices", values: [288.4, 305.1, 324.7, 342.9, 336.2, 361.8, 383.5, 396.2, 404.9, 412.6], source: "National Accounts, Q3 2025" },
  gdpGrowth: { label: "Real GDP growth", unit: "% change on previous year", values: [3.1, 3.8, 4.2, 3.6, -1.8, 4.9, 5.3, 4.1, 3.7, 3.9], source: "National Accounts, Q3 2025" },
  cpi: { label: "Consumer price inflation", unit: "% change on previous year", values: [2.4, 2.9, 3.3, 2.7, 1.9, 3.4, 6.8, 5.2, 3.8, 3.1], source: "Consumer Price Index, October 2025" },
  unemployment: { label: "Unemployment rate", unit: "% of labour force", values: [6.8, 6.5, 6.1, 5.9, 7.9, 7.2, 6.4, 5.9, 5.6, 5.4], source: "Labour Force Survey, October 2025" },
  lifeExpectancy: { label: "Life expectancy at birth", unit: "years", values: [72.1, 72.4, 72.8, 73.1, 73.0, 73.6, 74.0, 74.3, 74.6, 74.8], source: "Vital Statistics 2025" },
};

// Headline indicators shown on the home page.
const HEADLINES = [
  { key: "population", value: "48.24m", change: "+0.9% on 2024", note: "Resident population, mid-2025", page: "population" },
  { key: "gdp", value: "412.6bn ARU", change: "+3.9% real growth", note: "GDP, 2025 (current prices)", page: "economy" },
  { key: "gdpPerCapita", value: "8,552 ARU", change: "+3.0% on 2024", note: "GDP per capita, 2025", page: "economy" },
  { key: "cpi", value: "3.1%", change: "−0.7 pp on 2024", note: "CPI inflation, October 2025", page: "economy" },
  { key: "unemployment", value: "5.4%", change: "−0.2 pp on 2024", note: "Unemployment, October 2025", page: "economy" },
  { key: "lifeExpectancy", value: "74.8 yrs", change: "+0.2 yrs on 2024", note: "Life expectancy at birth, 2025", page: "population" },
];

// Age structure, % of population. Source: Population Estimates 2025.
const AGE_STRUCTURE = {
  2015: [
    { group: "0–14", value: 25.1 },
    { group: "15–24", value: 17.8 },
    { group: "25–54", value: 39.6 },
    { group: "55–64", value: 9.8 },
    { group: "65+", value: 7.7 },
  ],
  2025: [
    { group: "0–14", value: 22.4 },
    { group: "15–24", value: 16.1 },
    { group: "25–54", value: 41.2 },
    { group: "55–64", value: 11.3 },
    { group: "65+", value: 9.0 },
  ],
};

// Provinces. Populations sum to 48.24m. Source: Regional Accounts 2025.
const PROVINCES = [
  { name: "Telukraya", capital: "Kota Arun", population: 9.84, gdpPerCapita: 14230, unemployment: 4.8, density: 412 },
  { name: "Danumara", capital: "Banda Daru", population: 7.12, gdpPerCapita: 9410, unemployment: 5.1, density: 96 },
  { name: "Selatbiru", capital: "Pelabuhan Biru", population: 6.58, gdpPerCapita: 8760, unemployment: 5.6, density: 141 },
  { name: "Gunungapi", capital: "Kota Lava", population: 5.93, gdpPerCapita: 7120, unemployment: 6.2, density: 88 },
  { name: "Pantaikencana", capital: "Pantai Emas", population: 5.47, gdpPerCapita: 6890, unemployment: 5.9, density: 123 },
  { name: "Lembahhijau", capital: "Hijau Raya", population: 4.86, gdpPerCapita: 6340, unemployment: 6.6, density: 74 },
  { name: "Kepulauan Timur", capital: "Timur Jaya", population: 4.71, gdpPerCapita: 5980, unemployment: 6.1, density: 58 },
  { name: "Daratan Utara", capital: "Utara Kota", population: 3.73, gdpPerCapita: 5210, unemployment: 7.3, density: 41 },
];

// Economy structure. Source: National Accounts 2025.
const SECTORS = [
  { name: "Services", share: 58.2, detail: "Trade, transport, finance, public services" },
  { name: "Industry", share: 27.4, detail: "Manufacturing, mining, construction, utilities" },
  { name: "Agriculture, forestry & fishing", share: 14.4, detail: "Crops, livestock, timber, fisheries" },
];

// Trade. Source: External Trade Statistics, September 2025.
const TRADE = {
  exports: 96.4, imports: 88.1, balance: 8.3, year: 2025,
  partners: [
    { name: "Meridia", share: 21.6 },
    { name: "Kestrel Union", share: 17.3 },
    { name: "Southerland", share: 12.8 },
    { name: "Ostara", share: 9.4 },
    { name: "Other partners", share: 38.9 },
  ],
};

// Latest releases. Source: ANSO release calendar.
const RELEASES = [
  { date: "26 Nov 2025", title: "Consumer Price Index, October 2025", topic: "Prices", note: "Inflation eased to 3.1% as food prices fell 0.4% on the month." },
  { date: "19 Nov 2025", title: "Labour Force Survey, October 2025", topic: "Labour", note: "Unemployment 5.4%; employment rose by 214,000 on the year." },
  { date: "12 Nov 2025", title: "National Accounts, Q3 2025", topic: "Economy", note: "GDP grew 3.9% on the year; services contributed 2.4 points." },
  { date: "05 Nov 2025", title: "Population Estimates, mid-2025", topic: "Population", note: "Population 48.24 million; median age 31.2 years." },
  { date: "29 Oct 2025", title: "External Trade, September 2025", topic: "Economy", note: "Trade surplus 8.3bn ARU; exports up 6.2% on the year." },
  { date: "22 Oct 2025", title: "Regional Accounts 2025", topic: "Economy", note: "Telukraya remains the largest regional economy at 31.8% of GDP." },
  { date: "15 Oct 2025", title: "Vital Statistics 2025", topic: "Population", note: "Life expectancy 74.8 years; births 612,000, deaths 348,000." },
  { date: "08 Oct 2025", title: "Consumer Price Index, September 2025", topic: "Prices", note: "Inflation 3.4%; transport prices rose 1.1% on the month." },
];

const RELEASE_TOPICS = ["All", "Economy", "Population", "Prices", "Labour"];

// What each figure means, for the methodology page.
const METHODS = [
  { term: "Resident population", text: "People usually resident in Arunaya on 30 June of the reference year, including citizens abroad for less than 12 months. Source: civil registration adjusted by the 2024 census." },
  { term: "Real GDP growth", text: "Change in the volume of gross domestic product, chain-linked to 2020 prices, seasonally adjusted. Source: National Accounts, compiled under SNA 2008." },
  { term: "CPI inflation", text: "Annual change in the Consumer Price Index, a fixed basket of 412 goods and services priced monthly in 24 towns. Base year 2020 = 100." },
  { term: "Unemployment rate", text: "People aged 15–64 without work, available to start within two weeks and actively seeking work in the previous four weeks, as a share of the labour force. Source: quarterly Labour Force Survey, 18,400 households." },
  { term: "GDP per capita", text: "GDP at current prices divided by the mid-year resident population. Provincial figures use regional GDP divided by provincial population." },
];

function lastValue(key) {
  const s = SERIES[key];
  return s.values[s.values.length - 1];
}

function fmt(n, digits) {
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
