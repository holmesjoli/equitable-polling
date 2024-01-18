2016 Wisconsin precinct and election results shapefile.

## RDH Date retrieval
03/25/2021

## Sources
Election results and precinct shapefile from Wisconsin State Legislature Open Data Portal (https://data-ltsb.opendata.arcgis.com/)


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
G16PRERTru - Donald J. Trump (Republican Party)
G16PREDCli - Hillary Clinton (Democratic Party)
G16PRECCas - Darrell L. Castle (Constitution Party)
G16PRELJoh - Gary Johnson (Libertarian Party)
G16PREGSte - Jill Stein (Green Party)
G16PREOth - Write-in Votes

G16USSRJoh - Ron Johnson (Republican Party)
G16USSDFei - Russ Feingold (Democratic Party)
G16USSLAnd - Phillip N. Anderson (Libertarian Party)
G16USSOth - Write-in Votes


## Processing Steps
The shapefile used for the 2016 election results was the 2017 wards shapefile. The 2017 wards shapefile featured multiple changes and corrections to the ward boundaries what were already in effect for the November 2016 general election but were not in the January 2016 wards shapefile.

Several thousand votes were reported for the town of Menasha, which had almost entirely been incorporated into the village of Fox Crossing. 
The ward numbers in the Menasha results matched exactly the wards in Fox Crossing that didn't report any results, so the Menasha results were applied to Fox Crossing.

The following wards had been added due to annexations subsequent to the 2016 general election. They were merged back into the 2016 wards along with any associated election results.

Brown: Wrightstown 5
Clark: Abbotsford 7
Dane: DeForest 18, Sun Prairie 22
Eau Claire: Eau Claire 68
Fond du Lac: Fond du Lac 28
Green Lake: Green Lake 4
Kenosha: Kenosha 94
La Crosse: Holmen 12
Manitowoc: Manitowoc 29
Marathon: Wausau 48
Monroe: Tomah 21
Outagamie: Combined Locks 6, Kaukauna 13
Washington: Slinger 9
Waukesha: Sussex 10
Waupaca: Clintonville 9, 10
Winnebago: Menasha 39-42, Neenah 26

These additional changes were made to reflect the 2016 ward-by-ward results.

Grant: Split Platteville 8/9
Jefferson: Renumber Watertown 3 to Watertown 19
La Crosse: Split Holland 1 from Holmen 2
Winnebago: Relabel Fox Crossing 8-13 as Menasha 8-13

Note that the election results for Holland 1-6 and Holmen 1-11 in La Crosse County were reapportioned accordingly using the same whole population methodology as the WI Legislative Technology Services Bureau.