2018 South Carolina precinct and election shapefile.

## RDH Date retrieval
07/12/2020

## Sources
Election results from South Carolina State Election Commission (https://www.enr-scvotes.org/SC/92124/Web02-state.222648/#/)
Precinct shapefile primarily from the U.S. Census Bureau's 2020 Redistricting Data Program Phase 2 release. The Lando/Lansford precinct in Chester County was merged to match the 2018 election results.

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
G18GOVDSMI - James Smith (Democratic Party)
G18GOVRMCM - Henry McMaster (Republican Party)
G18GOVOWRI - Write-in Votes

G18SOSDWHI - Melvin T. Whittenburg (Democratic Party)
G18SOSRHAM - Mark Hammond (Republican Party)
G18SOSOWRI - Write-in Votes

G18TREDGLE - Rosalyn L. Glenn (Democratic Party)
G18TREWGLE - Rosalyn Glenn (Working Familites Party)
G18TRERLOF - Curtis Loftis (Republican Party)
G18TREAWOR - Sarah Work (American Party)
G18TREOWRI - Write-in Votes

G18ATGDANA - Constance Anastopoulo (Democratic Party)
G18ATGWANA - Constance Anastopoulo (Working Families Party)
G18ATGRWIL - Alan Wilson (Republican Party)
G18ATGOWRI - Write-in Votes

G18COMRECK - Richard Eckstrom (Republican Party)
G18COMOWRI - Write-in Votes

G18SPIRMIT - Molly Mitchell Spearman (Republican Party)
G18SPIOWRI - Write-in Votes

G18AGRUNEL - Chris Nelums (United Citizens Party)
G18AGRGEDM - David Edmond (Green Party)
G18AGRRWEA - Hugh Weathers (Republican Party)
G18AGROWRI - Write-in Votes

## Processing Steps
Absentee, provisional, emergency, and failsafe results were reported countywide. These were distributed to precincts based on the precinct's share of the county vote for each candidate.

In Spartanburg County the precinct labels for Trinity Methodist, Trinity Presbyterian, and West View Elementary were swapped to match the voter registration file. The boundary between Trinity Presbyterian and West View Elementary was also adjusted to match the county precinct map and the voter registration file.