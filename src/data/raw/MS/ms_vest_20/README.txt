2020 Mississippi precinct and election shapefile.

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
AGR - Agriculture Commissioner
ATG - Attorney General
AUD - Auditor
COC - Corporation Commissioner
COU - City Council Member
DEL - Delegate to the U.S. House
GOV - Governor
H## - U.S. House, where ## is the district number. AL: at large.
INS - Insurance Commissioner
LAB - Labor Commissioner
LAN - Commissioner of Public Lands
LTG - Lieutenant Governor
PRE - President
PSC - Public Service Commissioner
RRC - Railroad Commissioner
SAC - State Appeals Court (in AL: Civil Appeals)
SCC - State Court of Criminal Appeals
SOS - Secretary of State
SSC - State Supreme Court
SPI - Superintendent of Public Instruction
TRE - Treasurer
USS - U.S. Senate

Party Codes
D and R will always represent Democrat and Republican, respectively.
See the state-specific notes for the remaining codes used in a particular file; note that third-party candidates may appear on the ballot under different party labels in different states.

## Fields
G20PRERTRU - Donald J. Trump (Republican Party)
G20PREDBID - Joseph R. Biden (Democratic Party)
G20PRELJOR - Jo Jorgensen (Libertarian Party)
G20PREGHAW - Howie Hawkins (Green Party)
G20PREABLA - Don Blakenship (American Constitution Party)
G20PREOCAR - Brian Caroll (American Solidarity Party)
G20PREIWES - Kanye West (Independent)
G20PREICOL - Phil Collins (Prohibition Party)
G20PREIPIE - Brock Pierce (Independent)

G20USSRHYD - Cindy Hyde-Smith (Republican Party)
G20USSDESP - Mike Espy (Democratic Party)
G20USSLEDW - Jimmy L. Edwards (Libertarian Party)

## Processing Steps
Precinct boundaries were adjusted as appropriate to align with county maps, supervisor districts, or prior versions of the Census VTDs. Precinct boundaries throughout the state were further reviewed with the voter registration file in effect for the November 2020 general election. Voting districts in nearly all counties were edited accordingly to align with reporting units in the 2020 election results. In some counties the resulting boundaries differ substantially from the 2020 Census VTDs. As these boundary revisions were so extensive only splits and merges are specified below by precinct.

Some Mississippi counties name precincts after polling places and therefore change precinct names when polling places change regardless of whether this involves a change in boundaries. Precinct names were edited wherever necessary to match the November 2020 canvass results.

In Kemper County an alphabetic name split of Scooba precinct was reported as separate line items. These were merged in the shapefile.

The following splits and merges were made to align voting district boundaries with reporting units in the 2020 election results.

Attala: Merge Northwest/Aponaug
Claiborne: Split 2A/2B, 4A/4B
Hinds: Merge 12/13, 16/17, 21/24, 26/87, 50/51/52, 67/89/90, 69/75, 94/95, 77/97
Itawamba: Split Friendship, Mantachie by supervisor district
Jackson: Merge all A/B/C/D splits
Jefferson Davis: Split South Prentiss 12/13
Jones: Merge George Harrison/County Barn
Lauderdale: Merge 4/14, 10/15, 17/18/19, Alamucha/Mt Gilead, Andrews/Prospect as Gracepointe, Center Hill/Obadiah, Center Ridge/E Lauderdale, Clarkdale/Culpepper, Marion/E Marion, Russell/S Russell, Pickard/Sageville/Valley
Leflore: Split Morgan City/Swiftown by zip code
Simpson: Merge all A/B splits
Tallahatchie: Merge Sumner 2/Webb 2
Walthall: Merge E Tylertown A/B, W Tylertown A/B, S Knoxo/Tylertown 3
Wilkinson: Merge Woodville 5/5A
Yalobusha: Merge Two NE/SE as Water Valley; Split Scuna-Vann's Mill N/S
Yazoo: Merge Carter/Lake City, Deasonville/Harttown, Dover/Robinette as Little Yazoo, Fairview/Holly Bluff, Midway E/W, Tinsley into Mechanicsburg/Valley