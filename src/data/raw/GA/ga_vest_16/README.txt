2016 Georgia precinct and election results shapefile.

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
G16PRERTRU - Donald J. Trump (Republican Party)
G16PREDCLI - Hillary Clinton (Democratic Party)
G16PRELJOH - Gary Johnson (Libertarian Party)

G16USSRISA - Johnny Isakson (Republican Party)
G16USSDBAR - Jim Barksdale (Democratic Party)
G16USSLBUC - Allen Buckley (Libertarian Party)

G16PSCRECH - Tim Echols (Republican Party)
G16PSCLHOS - Eric Hoskins (Libertarian Party)

## Processing Steps
Fulton County: Precincts CH01/CH04B, CP07A/CP07D, SS29A/SS29B, UC031/UC035 were merged to match how voters were registered in the 2016 voter file.

The following precincts were split by congressional district to match the 2016 election results: Avondale High, Glennwood, Wadsworth in Dekalb County; Cates D in Gwinnett County.

Cloudland and Teloga precincts in Chattooga County were split along the ridgeline that marks the boundary between them with the USGS Topographic Contour shapefile.

Three of the four VTDs in Chattahoochee County are comprised of Fort Benning. However, the county only has one polling location for all voters, including residents of Fort Benning that vote within the county. The four Chattahoochee County VTDs have therefore been merged in the shapefile.

In Wilkes County the boundary between Precinct 1 and Precinct 2A was aligned with the voter file.
