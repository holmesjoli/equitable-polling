2020 Wisconsin precinct and election results shapefile.

## RDH Date retrieval
06/07/2021

## Sources
Election results and precinct shapefile from Wisconsin State Legislature Open Data Portal (https://data-ltsb.opendata.arcgis.com/)

## Fields metadata

Vote Column Label Format
------------------------
Columns reporting votes follow a standard label pattern. One example is:
G20PRERTRU
The first character is G for a general election, C for recount results, P for a primary, S for a special, and R for a runoff.
Characters 2 and 3 are the year of the election.
Characters 4-6 represent the office type (see list below).
Character 7 represents the party of the candidate.
Characters 8-10 are the first three letters of the candidate's last name.

Office Codes

ATG - Attorney General
AUD - Auditor
COC - Corporation Commissioner
COU - City Council Member
DEL - Delegate to the U.S. House
GOV - Governor
H## - U.S. House, where ## is the district number. AL: at large.
INS - Insurance Commissioner
LTG - Lieutenant Governor
PRE - President
PSC - Public Service Commissioner
SAC - State Appeals Court (in AL: Civil Appeals)
SCC - State Court of Criminal Appeals
SOS - Secretary of State
SPI - Superintendent of Public Instruction
USS - U.S. Senate

Party Codes
D and R will always represent Democrat and Republican, respectively.
See the state-specific notes for the remaining codes used in a particular file; note that third-party candidates may appear on the ballot under different party labels in different states.

## Fields

G20PREDBID - Joseph R. Biden (Democratic Party)
G20PRERTRU - Donald J. Trump (Republican Party)
G20PRELJOR - Jo Jorgensen (Libertarian Party)
G20PRECBLA - Don Blankenship (Constitution Party)
G20PREICAR - Brain Carroll (Independent)
G20PREOHAW - Howie Hawkins (Independent write-in)
G20PREOWES - Kanye West (Independent write-in)
G20PREOLAR - Gloria La Riva (Independent write-in)
G20PREOCHA - Mark Charles (Independent write-in)
G20PREOSIM - Jade Simmons (Independent write-in)
G20PREOWEL - Kasey Wells (Independent write-in)
G20PREOBOD - R19 Boddie (Independent write-in)
G20PREOWRI - Other Write-in Votes

## Processing Steps

The following wards had been added due to annexations prior to the 2020 general election. They appear in the 2020 election results but not in the LTSB 2020 shapefile. They were added using the 2021 municipal wards shapefile. Any associated election results were redistributed based on the number of registered voters by ward as of 11/01/2020.

Chippewa: Chippewa Falls 5A
Dane: DeForest 23
Eau Claire: Eau Claire 80, 81
Kenosha: Kenosha 116
Manitowoc: Manitowoc 32
Sauk: Prairie du Sac 5
Wood: Marshfield 25, 26; Wisconsin Rapids 26, 27, 29