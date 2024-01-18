2016 South Carolina precinct and election results shapefile.

## RDH Date retrieval
01/12/2022

## Sources
Election results from South Carolina State Election Commission (http://www.enr-scvotes.org/SC/64658/184701/en/select-county.html)
Precinct shapefiles were generously supplied by Victor Frontroth of the Mapping Section of the South Carolina Revenue and Fiscal Affairs Office

## Fields metadata

Vote Column Label Format
------------------------
Columns reporting votes follow a standard label pattern. One example is:
G16PREDCli
The first character is G for a general election, P for a primary, C for a caucus, R for a runoff, S for a special.
Characters 2 and 3 are the year of the election.
Characters 4-6 represent the office type (see list below).
Character 7 represents the party of the candidate.
Characters 8-10 are the first three letters of the candidate's last name.

Office Codes
AGR - Commissioner of Agriculture
ATG - Attorney General
AUD - Auditor
COM - Comptroller
COU - City Council Member
DEL - Delegate to the U.S. House
GOV - Governor
H## - U.S. House, where ## is the district number. AL: at large.
HOD - House of Delegates, accompanied by a HOD_DIST column indicating district number
HOR - U.S. House, accompanied by a HOR_DIST column indicating district number
INS - Commissioner of Insurance
LAB - Commissioner of Labor
LTG - Lieutenant Governor
LND - Commissioner of Public Lands
PRE - President
PSC - Public Service Commissioner
PUC - Public Utilities Commissioner
RGT - State University Regent
RRC - Railroad Commissioner
SAC - State Court of Appeals
SCC - State Court of Criminal Appeals
SOS - Secretary of State
SOV - Senate of Virginia, accompanied by a SOV_DIST column indicating district number
SPI - Superintendent of Public Instruction
SSC - State Supreme Court
TRE - Treasurer
USS - U.S. Senate

Party Codes
D and R will always represent Democrat and Republican, respectively.
See the state-specific notes for the remaining codes used in a particular file; note that third-party candidates may appear on the ballot under different party labels in different states.

## Fields
G16PREDCLI - Hillary Clinton (Democratic Party)
G16PRERTRU - Donald Trump (Republican Party)
G16PRELJOH - Gary Johnson (Libertarian Party)
G16PREGSTE - Jill Stein (Green Party)
G16PREIMCM - Evan McMullin (Independent)
G16PRECCAS - Darrell L. Castle (Constitution Party)
G16PREASKE - Peter Skewes (American Party)

G16USSDDIX - Thomas Dixon (Democratic Party, Working Families Party, and Green Party (fusion candidate))
G16USSRSCO - Tim Scott (Republican Party)
G16USSLBLE - Bill Bledsoe (Libertarian Party and Constitution Party (fusion candidate))
G16USSASCA - Rebel Michael Scarborough (American Party)
G16USSOWRI - Write-in Votes

## Processing Steps
Absentee, provisional, emergency, and failsafe results were reported countywide. These were distributed to precincts based on the precinct's share of the county vote for each candidate.