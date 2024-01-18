2018 Georgia precinct and election results shapefile.

## RDH Date retrieval
06/29/2021

## Sources
Election results from the Georgia Secretary of State Elections Division(https://sos.ga.gov/index.php/Elections/current_and_past_elections_results)
Precinct shapefile primarily from the Georgia General Assembly Reapportionment Office (http://www.legis.ga.gov/Joint/reapportionment/en-US/default.aspx)
Fulton County uses shapefiles and maps sourced from the county GIS program. 

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

G18GOVRKEM - Brian Kemp (Republican Party)
G18GOVDABR - Stacey Abrams (Democratic Party)
G18GOVLMET - Ted Metz (Libertarian Party)

G18LTGRDUN - Geoff Duncan (Republican Party)
G18LTGDAMI - Sarah Riggs Amico (Democratic Party)

G18SOSRRAF - Brad Raffensperger (Republican Party)
G18SOSDBAR - John Barrow (Democratic Party)
G18SOSLDUV - Smythe Duval (Libertarian Party)

G18ATGRCAR - Chris Carr (Republican Party)
G18ATGDBAI - Charlie Bailey (Democratic Party)

G18AGRRBLA - Gary Black (Republican Party)
G18AGRDSWA - Fred Swann (Democratic Party)

G18INSRBEC - Jim Beck (Republican Party)
G18INSDLAW - Janice Laws (Democratic Party)
G18INSLFOS - Donnie Foster (Libertarian Party)

G18SPIRWOO - Richard Woods (Republican Party)
G18SPIDTHO - Otha E. Thornton, Jr. (Democratic Party)

G18LABRBUT - Mark Butler (Republican Party)
G18LABDKEA - Richard Keatley (Democratic Party)

G18PSCREAT - Chuck Eaton (Republican Party)
G18PSCDMIL - Lindy Miller (Democratic Party)
G18PSCLGRA - Ryan Graham (Libertarian Party)

G18PSCRPRI - Tricia Pridemore (Republican Party)
G18PSCDRAN - Dawn A. Randolph (Democratic Party)
G18PSCLTUR - John Turpish (Libertarian Party)

R18SOSRRAF - Brad Raffensperger (Republican Party)
R18SOSDBAR - John Barrow (Democratic Party)

R18PSCREAT - Chuck Eaton (Republican Party)
R18PSCDMIL - Lindy Miller (Democratic Party)

## Processing Steps

Fulton County: Precincts CH01/CH04B, CP07A/CP07D, SS29A/SS29B, UC031/UC035 were merged to match how voters were registered in the 2018 voter file.

The following precincts were split by congressional district to match the 2018 election results: Avondale High, Glennwood, Wadsworth in Dekalb County; Cates D in Gwinnett County.

Cloudland and Teloga precincts in Chattooga County were split along the ridgeline that marks the boundary between them with the USGS Topographic Contour shapefile.

Three of the four VTDs in Chattahoochee County are comprised of Fort Benning. However, the county only has one polling location for all voters, including residents of Fort Benning that vote within the county. The four Chattahoochee County VTDs have therefore been merged in the shapefile.

In Wilkes County the boundary between Precinct 1 and Precinct 2A was aligned with the voter file.
