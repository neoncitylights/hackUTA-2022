import express from 'express';
import { query } from './db/infra.js';
import { createTables, loadSources } from './db/functions.js';

void (async () => {
    try {
        await createTables();

        const app = express();
        app.use(express.json());

        app
            .post('/api/load-csv', async (req, res) => {
                if (typeof req.body === 'object' && typeof req.body.csv_content === 'string') {
                    // await loadSources(req.body.csv_content);
                    await loadSources(`Name,URL,License,Origin
BuzzFeedNews,https://github.com/BuzzFeedNews,Unknown,BuzzFeed News
OurData | By FiveThirtyEight,https://data.fivethirtyeight.com/,Unknown,FiveThirtyEight
The State of the Octoverse,https://octoverse.github.com/,Unknown,GitHub
COVID-19 Public Repository Data,https://github.com/github/covid-19-repo-data,Unknown,GitHub
AudioSet,https://research.google.com/audioset/,Unknown,Google
Data from Google Trends,http://googletrends.github.io/data/,Unknown,Google
Dataset Search by Google Research,https://datasetsearch.research.google.com/,Unknown,Google
DEep MOdel GENeralization dataset (DEMOGEN),https://github.com/google-research/google-research/tree/master/demogen,Unknown,Google
Earth Engine Data Catalog,https://developers.google.com/earth-engine/datasets/,Unknown,Google
Google Brain Robotics Data,https://sites.google.com/site/brainrobotdata/home,Unknown,Google
Google Landmarks,https://github.com/cvdfoundation/google-landmark,Unknown,Google
Google Research,https://research.google/,Unknown,Google
Google Trends,https://trends.google.com/trends/,Unknown,Google
Google's Natural Questions,https://ai.google.com/research/NaturalQuestions,Unknown,Google
Open Images Dataset,https://github.com/openimages/dataset,Unknown,Google
Public Datasets | Google Cloud,https://cloud.google.com/public-datasets/,Unknown,Google
The NSynth Dataset,https://magenta.tensorflow.org/datasets/nsynth,Unknown,Google
Stack Overflow Annual Developer Survey,https://insights.stackoverflow.com/survey,Unknown,Stack Overflow
Unsplash Dataset,https://unsplash.com/data,Unknown,Unsplash
Digital Earth Africa,https://www.digitalearthafrica.org/,Unknown,Africa
Data & Publications | Geoscience Australia,https://www.ga.gov.au/data-pubs,Unknown,Australia
http://data.gov.au | Australian Government - Data,https://data.gov.au/,Unknown,Australia
Data.NSW | New South Wales Government - Data,https://data.nsw.gov.au/,Unknown,"Australia, New South Wales"
http://data.SA | South Australian Government - Data,https://data.sa.gov.au/,Unknown,"Australia, South Australia"
http://data.wa.gov.au/ | Western Australian Government - Data,https://catalogue.data.wa.gov.au/,Unknown,"Australia, Western Australia"
"Environmental information and data | Department of Agriculture, Water and the Environment",http://www.environment.gov.au/about-us/environmental-information-data,Unknown,Australia
Open Data Cube | Digital Earth Australia,https://www.ga.gov.au/dea/odc,Unknown,Australia
Public Data | Department of the New Minister and Cabinet | Australian Government,https://pmc.gov.au/public-data,Unknown,Australia
Research Data Australia,https://researchdata.edu.au/,Unknown,Australia
Austria - OECD Data,https://data.oecd.org/austria.htm,Unknown,"Austria, OECD"
Climate Data Canada,https://climatedata.ca/,Unknown,Canada
COVID-19 Tracker Canada,https://covid19tracker.ca/,Unknown,Canada
Drug Product Database,https://www.canada.ca/en/health-canada/services/drugs-health-products/drug-products/drug-product-database.html,Unknown,Canada
Health Data Research Network Canada,https://www.hdrn.ca/,Unknown,Canada
Ocean Networks Canada,https://oceannetworks.ca/data-tools/get-data/data-search,Unknown,Canada
"Open Data | Open Government, Government of Canada",https://open.canada.ca/en/open-data,Unknown,Canada
Statistics Canada,https://www.statcan.gc.ca/eng/start,Unknown,Canada
Dansk Demografisk Database,https://ddd.dda.dk/ddd_en.htm,Unknown,Denmark
Open Data DK,https://www.opendata.dk/,Unknown,Denmark
http://avoindata.fi/,https://www.avoindata.fi/en,Unknown,Finland
http://data.gouv.fr/,https://www.data.gouv.fr/en/,Unknown,France
Germany - OECD Data,https://data.oecd.org/germany.htm,Unknown,"Germany, OECD"
Greece - OECD Data,https://data.oecd.org/greece.htm,Unknown,"Greece, OECD"
National Institute of Statistics and Geography,http://en.www.inegi.org.mx/default.html,Unknown,Mexico
Discover and use data - http://data.govt.nz/,https://data.govt.nz/,Unknown,New Zealand
Norway - OECD Data,https://data.oecd.org/norway.htm,Unknown,"Norway, OECD"
http://data.gov.uk/ | Find open data,https://data.gov.uk/,Unknown,United Kingdom
London Datastore,https://data.london.gov.uk/,Unknown,United Kingdom
Office for National Statistics,https://www.ons.gov.uk/census,Unknown,United Kingdom
Oil & Gas Authority,https://www.ogauthority.co.uk/data-centre/,Unknown,United Kingdom
CDC COVID Data Tracker,https://covid.cdc.gov/covid-data-tracker/,Unknown,United States
http://data.gov | US government open data,https://www.data.gov/,Unknown,United States
Disability Data | Interagency Committee on Disability Research,https://icdr.acl.gov/resources/disability-data,Unknown,"Interagency Committee on Disability Research, United States"
http://healthdata.gov/,https://healthdata.gov/,Unknown,United States
United States Census Bureau,https://www.census.gov/,Unknown,United States
United States International Trade Commission | DataWeb,https://dataweb.usitc.gov/,Unknown,United States
EU Open Data Portal,https://data.europa.eu/euodp/en/home,Unknown,European Union
SDG Indicators,https://unstats.un.org/sdgs/metadata/,Unknown,United Nations
UN Comtrade Database,https://comtrade.un.org/,Unknown,United Nations
UN Disability Statistics,https://unstats.un.org/unsd/demographic-social/sconcerns/disability/statistics/#/home,Unknown,United Nations
UN Gender Statistics,https://genderstats.un.org/,Unknown,United Nations
UNdata,https://data.un.org/,Unknown,United Nations
Amphibian Species of the World,https://amphibiansoftheworld.amnh.org/,Unknown,American Museum of Natural History
Key Biodiversity Areas,http://www.keybiodiversityareas.org/,Unknown,"BirdLife International, IUCN"
Corpus of Contemporary American English,https://www.english-corpora.org/coca/,Unknown,Corpus of Contemporary American English
FreeCodeCamp | Open data,https://github.com/freeCodeCamp/open-data,Unknown,FreeCodeCamp
Corporate Equality Index | HRC,https://www.hrc.org/resources/corporate-equality-index,Unknown,Human Rights Campaign
LGBTQ Student Scholarship Database | HRC,https://www.hrc.org/resources/scholarships,Unknown,Human Rights Campaign
Municipality Database | HRC,https://www.hrc.org/resources/municipalities,Unknown,Human Rights Campaign
Municipality Equality Index | HRC,https://www.hrc.org/resources/municipal-equality-index,Unknown,Human Rights Campaign
State Equality Index | HRC,https://www.hrc.org/resources/state-equality-index,Unknown,Human Rights Campaign
State Scorecards | HRC,https://www.hrc.org/resources/state-scorecards,Unknown,Human Rights Campaign
HydroSHEDS,https://www.hydrosheds.org/,Unknown,"HydroSHEDS, McGill University, World Wildlife Foundation"
Protected Planet | IUCN,https://www.protectedplanet.net/en,Unknown,IUCN
The IUCN Red List of Threatened Species,https://www.iucnredlist.org/,Unknown,IUCN
World Heritage Outlook | IUCN,https://worldheritageoutlook.iucn.org/,Unknown,IUCN
MDN Docs | Browser compatibility data,https://github.com/mdn/browser-compat-data,Unknown,Mozilla
Web DNA Report | MDN Docs,https://insights.developer.mozilla.org/,Unknown,Mozilla
NADP Maps and Data | National Atmospheric Deposition Program,http://nadp.slh.wisc.edu/data/,Unknown,"National Atmospheric Deposition Program, University of Wisconsin-Madison"
Goddard Institute for Space Studies: Data and Images,https://data.giss.nasa.gov/,Unknown,NASA
NASA Earth Observations,https://neo.sci.gsfc.nasa.gov/,Unknown,NASA
NASA's Open Data Portal,https://data.nasa.gov/browse,Unknown,NASA
Prognostics Center of Excellence - Data Repository,https://ti.arc.nasa.gov/tech/dash/groups/pcoe/prognostic-data-repository/,Unknown,NASA
"Sample Curvilinear Mesh, CFD Datasets from NAS",https://www.nas.nasa.gov/publications/datasets.html,Unknown,NASA
Global Maps | NASA Earth Observatory,https://www.earthobservatory.nasa.gov/global-maps,Unknown,NASA
NASA Prediction Of Worldwide Energy Resources,https://power.larc.nasa.gov/,Unknown,NASA
NASA Planetary Data System,https://pds.nasa.gov/,Unknown,NASA
Precipitation Data Directory | NASA Global Precipitation Measurement Mission,https://gpm.nasa.gov/data/directory,Unknown,NASA
GLDAS Forcing Data | LDAS,https://ldas.gsfc.nasa.gov/gldas/forcing-data,Unknown,NASA
Earthdata Search,https://search.earthdata.nasa.gov/search,Unknown,NASA
UNICEF Data,https://data.unicef.org/,Unknown,UNICEF
WHO | Global Health Observatory,https://www.who.int/data/gho/,Unknown,WHO
Wikimedia Commons,https://commons.wikimedia.org/,Unknown,Wikimedia Foundation
World Bank | Data Catalog,https://datacatalog.worldbank.org/,Unknown,World Bank
Caniuse,https://github.com/Fyrd/caniuse,Unknown,Fyrd
Research Datasets | SSRI,https://ssri.duke.edu/data-it/research-datasets,Unknown,Duke University
Find Datasets - Machine Learning and AI - LibGuides at Carnegie Mellon University,https://guides.library.cmu.edu/machine-learning/datasets,Unknown,Carnegie Mellon University
The CMU Pronouncing Dictionary,http://www.speech.cs.cmu.edu/cgi-bin/cmudict,Unknown,Carnegie Mellon University
Cornell Datasets,http://www.cs.cornell.edu/home/llee/data/,Unknown,Cornell University
Harvard Dataverse,https://dataverse.harvard.edu/,Unknown,Harvard University
Harvard University | Datasets from NCES,http://gseacademic.harvard.edu/~willetjo/nces.htm,Unknown,Harvard University
Shared Datasets | Center for Artificial Intelligence in Medicine & Imaging,https://aimi.stanford.edu/research/public-datasets,Unknown,Stanford University
Stanford Large Network Dataset Collection,https://snap.stanford.edu/data/,Unknown,Stanford University
Datasets | MIT Lincoln Labratory,https://www.ll.mit.edu/r-d/datasets,Unknown,Massachusetts Institute of Technology
UCI Machine Learning Repository,https://archive.ics.uci.edu/ml/index.php,Unknown,University of California Irvine
UCI | Coronavirus Information Hub,https://uci.edu/coronavirus/,Unknown,University of California Irvine
LGBT Data & Demographics – The Williams Institute,https://williamsinstitute.law.ucla.edu/visualization/lgbt-stats/?topic=LGBT,Unknown,University of California Los Angeles
Same-sex Couple Data & Demographics – The Williams Institute,https://williamsinstitute.law.ucla.edu/visualization/lgbt-stats/?topic=SS,Unknown,University of California Los Angeles
University of Florida | Datasets,http://users.stat.ufl.edu/~winner/datasets.html,Unknown,University of Florida
Find Research Data — University of Illinois at Urbana-Champaign,https://experts.illinois.edu/en/datasets/,Unknown,University of Illinois at Urbana–Champaign
Research Datasets | MIDAS,https://midas.umich.edu/research-datasets/,Unknown,University of Michigan
Annual Disability Statistics Compendium,https://disabilitycompendium.org/,Unknown,"Annual Disability Statistics Compendium, University of New Hampshire"
Our World in Data,https://ourworldindata.org/,Unknown,University of Oxford
UTK Common Data Set,https://oira.utk.edu/reporting/common-data-set/,Unknown,University of Tennessee Knoxville
UTA Common Data Set,https://www.uta.edu/analytics/Report/Common%20Data%20Set/index.php,Unknown,University of Texas at Arlington
GIS Data | Texas Architecture | UTSOA,https://soa.utexas.edu/programs/community-and-regional-planning/resources/gis-education-resources/gis-data,Unknown,University of Texas at Austin
UT Austin ARL Acoustic Underwater Dataset,http://users.ece.utexas.edu/~bevans/projects/underwater/datasets/,Unknown,University of Texas at Austin
UT-Austin Common Data Set,https://reports.utexas.edu/common-data-set,Unknown,University of Texas at Austin
UT-Austin Computer Vision Group Datasets,https://www.cs.utexas.edu/~grauman/research/datasets.html,Unknown,University of Texas at Austin
A Pressure Map Dataset for In-bed Posture Classification (Physionet Link),https://personal.utdallas.edu/~birjandtalab/Data.html,Unknown,Unversity of Texas at Dallas
UT-Dallas Common Data Set Initiative,https://www.utdallas.edu/ospa/common-data-set/,Unknown,Unversity of Texas at Dallas
UT-Dallas StARLing Lab Datasets,https://starling.utdallas.edu/datasets/,Unknown,Unversity of Texas at Dallas
UTSA Common Data Set,https://www.utsa.edu/ir/content/resources/commonDataSet.html,Unknown,University of Texas at San Antonio
UTEP Common Data Set,https://www.utep.edu/planning/cierp/institutional-data/common-data-set.html,Unknown,University of Texas at El Paso
UTEP Plants (Arctos),https://www.gbif.org/dataset/1a9d08bb-9e2c-4540-8f7f-3205846b6ddc,Unknown,University of Texas at El Paso
WSU CASAS Datasets,http://casas.wsu.edu/datasets/,Unknown,Washington State University
Wikidata,https://www.wikidata.org/,CC0-1.0,Wikimedia Foundation
Wiktionary,https://www.wiktionary.org/,CC-BY-SA-3.0,Wikimedia Foundation
ConceptNet,https://conceptnet.io/,CC-BY-SA-4.0,Common Sense
LibriSpeech ASR Corpus,https://www.openslr.org/12,CC-BY-4.0,Jan Yenda Trmal
WordNet,https://wordnet.princeton.edu/,WordNet 3.0 License,Princeton University
WordList SCOWL,http://wordlist.aspell.net/,MIT-like License,GNU
VoxCeleb,https://www.robots.ox.ac.uk/~vgg/data/voxceleb/,PD (Public Domain),University of Oxford
Google AudioSet,https://research.google.com/audioset/,PD (Public Domain),Google
Google YouTube-8M,https://research.google.com/youtube8m/,PD (Public Domain),Google
Mozilla Common Voice,https://commonvoice.mozilla.org/,PD (Public Domain),Mozilla Foundation
Duolingo Research,https://research.duolingo.com/,PD (Public Domain),Duolingo
FreeDict,https://freedict.org/,PD (Public Domain),The FreeDict Project
freeDictionaryAPI,https://dictionaryapi.dev/,PD (Public Domain),meetDeveloper
Dictionary.com,https://www.dictionary.com/,Proprietary,Dictionary.com
Oxford Advanced American Dictionary,https://www.oxfordlearnersdictionaries.com/us/definition/american_english/,Proprietary,University of Oxford
Thesaurus.com,https://www.thesaurus.com/,Proprietary,Dictionary.com
Oxford Learners Dicitonary,https://www.oxfordlearnersdictionaries.com/us/,Proprietary,University of Oxford
Oxford English Dictionary,https://www.oed.com/,Proprietary,University of Oxford
The Merriam-Webster Dictionary,https://dictionaryapi.com/,Fair use,Merriam-Webster
American Heritage Dictionary,https://www.ahdictionary.com/,Unknown,Houghton Mifflin
Collins English Dictionary,https://www.collinsdictionary.com/us/dictionary/english,Unknown,HarperCollins
Random House Webster's Unabridged Dictionary,http://www.randomhousebooks.com/books/7841/,Unknown,Random House`)
                    res.json({ success: true })
                } else {
                    res.statusCode = 400;
                    res.json({ success: false, message: 'Invalid body' });
                }
            })
            .get('/api/licenses', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                const result = await query(`SELECT DISTINCT license FROM sources`);
                res.json(result.rows.map(r => r.license));
            })
            .get('/api/origins', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                const result = await query(`SELECT DISTINCT origin FROM origins`);
                res.json(result.rows.map(r => r.origin));
            })
            .get('/api/source', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                const result = await query(
                    `SELECT s.*, o.origin as origins FROM sources AS s
                    JOIN origins AS o ON s.name = o.source_name`
                );
                res.json(result.rows);
            })
            .get('/', (req, res) => {
                res.send('root');
            })
            .listen(3001);
    } catch (e) {
        console.error(e);
    }
})();
