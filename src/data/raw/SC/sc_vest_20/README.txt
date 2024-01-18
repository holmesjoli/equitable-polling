2020 South Carolina precinct and election shapefile.

## RDH Date retrieval
06/10/2021

## Sources
Election results from South Carolina State Election Commission (https://www.enr-scvotes.org/SC/106502/Web02-state.264691/#/). 
Precinct shapefile provided by Victor Frontroth at the Mapping Section of the South Carolina Revenue and Fiscal Affairs Office.

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

G20PRERTRU - Donald J. Trump (Republican Party)
G20PREDBID - Joseph R. Biden (Democratic Party)
G20PRELJOR - Jo Jorgensen (Libertarian Party)
G20PREGHAW - Howie Hawkins (Green Party)
G20PREAFUE - Roque Rocky De La Fuente (Alliance Party)

G20USSRGRA - Lindsey Graham (Republican Party)
G20USSDHAR - Jaime Harrison (Democratic Party)
G20USSCBLE - Bill Bledsoe (Constitution Party)
G20USSOWRI - Write-in Votes

## Processing Steps
Provisional and failsafe ballots were reported countywide. These were distributed by candidate to precincts based on their share of the precinct-level reported vote.

In Jasper County the SC legislature enacted Hardeeville 3 and Okatie 2 for the 2020 elections. However, if in use they were not reported separately so Hardeeville 1/3 and Okatie 1/2 were merged in the shapefile.