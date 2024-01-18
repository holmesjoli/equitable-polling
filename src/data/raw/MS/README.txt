2018 Mississippi precinct and election shapefile.

## RDH Date retrieval
01/03/2022

## Sources
Election results from the Mississippi Secretary of State (https://www.sos.ms.gov/elections-voting/election-results). Precinct shapefiles initially from the U.S. Census Bureau's 2020 Redistricting Data Program.

## Fields metadata

Vote Column Label Format
------------------------
Columns reporting votes follow a standard label pattern. One example is:
G16PREDCli
The first character is G for a general election, P for a primary, S for a special, and R for a runoff.
Characters 2 and 3 are the year of the election.
Characters 4-6 represent the office type (see list below).
Character 7 represents the party of the candidate.
Characters 8-10 are the first three letters of the candidate's last name.

Office Codes
A## - Ballot amendment, where ## is an identifier
AGR - Commissioner of Agriculture
ATG - Attorney General
AUD - Auditor
CFO - Chief Financial Officer
CHA - Council Chairman
COC - Corporation Commissioner
COM - Comptroller
CON - State Controller
COU - City Council Member
CSC - Clerk of the Supreme Court
DEL - Delegate to the U.S. House
GOV - Governor
H## - U.S. House, where ## is the district number. AL: at large.
HOD - House of Delegates, accompanied by a HOD_DIST column indicating district number
HOR - U.S. House, accompanied by a HOR_DIST column indicating district number
INS - Insurance Commissioner
LAB - Labor Commissioner
LAN - Commissioner of General Land Office
LND - Commissioner of Public/State Lands
LTG - Lieutenant Governor
MAY - Mayor
MNI - State Mine Inspector
PSC - Public Service Commissioner
PUC - Public Utilities Commissioner
RGT - State University Regent
RRC - Railroad Commissioner
SAC - State Appeals Court (in AL: Civil Appeals)
SBE - State Board of Education
SCC - State Court of Criminal Appeals
SOC - Secretary of Commonwealth
SOS - Secretary of State
SPI - Superintendent of Public Instruction
SPL - Commissioner of School and Public Lands
SSC - State Supreme Court
TAX - Tax Commissioner
TRE - Treasurer
UBR - University Board of Regents/Trustees/Governors
USS - U.S. Senate

Party Codes
D and R will always represent Democrat and Republican, respectively.
See the state-specific notes for the remaining codes used in a particular file; note that third-party candidates may appear on the ballot under different party labels in different states.

## Fields
G18USSRWIC - Roger F. Wicker (Republican Party)
G18USSDBAR - David Baria (Democratic Party)
G18USSLBED - Danny Bedwell (Libertarian Party)
G18USSOOHA - Shawn O'Hara (Reform Party)

S18USSRHYD - Cindy Hyde-Smith (Republican Party)
S18USSRMCD - Chris McDaniel (Republican Party)
S18USSDESP - Mike Espy (Democratic Party)
S18USSDBAR - Tobey Bernard Bartee (Democratic Party)

R18USSRHYD - Cindy Hyde-Smith (Republican Party)
R18USSDESP - Mike Espy (Democratic Party)

## Processing Steps
Precinct boundaries were adjusted as appropriate to align with county maps, supervisor districts, or prior versions of the Census VTDs. Precinct boundaries throughout the state were further reviewed with the voter registration file in effect for the November 2018 general election. Voting districts in nearly all counties were edited accordingly to align with reporting units in the 2018 election results. In some counties the resulting boundaries differ substantially from the 2020 Census VTDs. As these boundary revisions were so extensive only splits and merges are specified below by precinct.

Some Mississippi counties name precincts after polling places and therefore change precinct names when polling places change regardless of whether this involves a change in boundaries. Precinct names were edited wherever necessary to match the November 2018 canvass results.

In Kemper County an alphabetic name split of Scooba precinct was reported as separate line items. These were merged in the shapefile.

The following splits and merges were made to align voting district boundaries with reporting units in the 2018 election results.

Attala: Merge Northwest/Aponaug
Claiborne: Split 2A/2B, 4A/4B
Covington: Split Seminary/West Collins
Grenada: Merge Mt. Nebo/Pleasant Grove
Hinds: Merge 12/13, 16/17, 26/87, 50/51/52, 67/89, 69/75, 94/95, 77/97
Itawamba: Split Friendship, Mantachie by supervisor district
Jackson: Merge all A/B/C/D splits
Jefferson Davis: Split South Prentiss 12/13
Jones: Merge George Harrison/County Barn
Lauderdale: Merge 10/15, 17/18/19, Alamucha/Mt Gilead, Center Hill/Obadiah, Center Ridge/E Lauderdale, Clarkdale/Culpepper, Marion/E Marion, Russell/S Russell, Pickard/Sageville/Valley
Leflore: Split Morgan City/Swiftown by zip code
Lowndes: Split Hunt/Propst Park Community Hut
Panola: Split Blackjack/Coles Point
Pearl River: Merge Poplarville 2/Spring Hill 2
Rankin: Split Antioch/Mayton, Brandon E/W
Simpson: Merge all A/B splits
Tallahatchie: Merge Sumner 2/Webb 2
Walthall: Merge E Tylertown A/B, W Tylertown A/B, S Knoxo/Tylertown 3
Wilkinson: Merge Woodville 5/5A
Yalobusha: Merge Two NE/SE as Water Valley
Yazoo: Merge Carter/Lake City, Deasonville/Harttown, Dover/Robinette as Little Yazoo, Fairview/Holly Bluff, Midway E/W, Tinsley into Mechanicsburg/Valley