2018 Wisconsin precinct and election shapefile.

## RDH Date retrieval
07/12/2020

## Sources
Election results and precinct shapefile from Wisconsin State Legislature Open Data Portal (https://data-ltsb.opendata.arcgis.com/)

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
LND - Commissioner of Public/State Lands
LTG - Lieutenant Governor
MAY - Mayor
MNI - State Mine Inspector
PSC - Public Service Commissioner
PUC - Public Utilities Commissioner
RGT - State University Regent
SAC - State Appeals Court
SBE - State Board of Education
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
G18USSRVUK - Leah Vukmir (Republican Party)
G18USSDBAL - Tammy Baldwin (Democratic Party)
G18USSOWRI - Write-in Votes

G18GOVRWAL - Scott Walker (Republican Party)
G18GOVDEVE - Tony Evers (Democratic Party)
G18GOVLAND - Phillip Anderson (Libertarian Party)
G18GOVGWHI - Michael J. White (Wisconsin Green Party)
G18GOVITUR - Maggie Turnbull (Independent)
G18GOVIENZ - Arnie Enz (Independent)
G18GOVOWRI - Write-in Votes

G18SOSRSCH - Jay Schroeder (Republican Party)
G18SOSDLAF - Doug La Follette (Democratic Party)
G18SOSOWRI - Write-in Votes

G18TRERHAR - Travis Hartwig (Republican Party)
G18TREDGOD - Sarah Godlewski (Democratic Party)
G18TRECZUE - Andrew Zuelke (Constitution Party)
G18TREOWRI - Write-in Votes

G18ATGRSCH - Brad Schimel (Republican Party)
G18ATGDKAU - Josh Kaul (Democratic Party)
G18ATGCLAR - Terry Larson (Constitution Party)
G18ATGOWRI - Write-in Votes

## Processing Steps
The following counties were revised with the voting district shapefiles from the U.S. Census Bureau's 2020 Redistricting Data Program Phase 2 release: Buffalo, Clark, Dunn, Grant, La Crosse, Marquette, Pepin, Trempealeau.