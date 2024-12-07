# Summary about the VNC and environments meeting with Or Gavriel

## Environments

To login to this different environments a VNC session centOS is required.
To get one go to the IT supprot and request a session

### The environments and servers

| Server | ipv4 addres   | L-Flex password | DVLP password |
|----------|----------|----------| ------ | 
| opt    | 10.7.30.x   |  12345  |   3tango        |
| optn    | 10.7.31.x  | 12345   | 3tango| 
| L-Flex    | 192.168.32.x  | 12345   |  3tango |
| L-Flex A   | 192.168.32.x  | 12345   |  3tango |

For each server there's a different "x" 
The X will be refered to as the address of the environment (Like "opt24" x = 24)

* DVLP- Development environment- not updated 
* L-Flex- updated ear day from the production lines

## How to connect to the environments

In the vnc session you can use the following commands:

To connect to server 10.7.30.24 (opt24)
```bash
ssh -X root@opt24 
```
According to the password (either L-Flex or DVLP) it will be decided what environment it will be
if connected to a DVLP environment it will be seen with:

```bash
[root@opt24-Development ~]#
```

It's also possible to use a script if connected to development environment to switch to to L-Flex 

```bash
[root@opt24-Development ~]# /net/10.228.0.103/local/tftpboot/tools/SPE-switch-env.sh L 
```
---

## Station managment

1. Login to the software using your user and password
2. Goto Test -> Installation -> Install test
3. Install test to L-Flex env or Production env

## Useful libraries

<b>/usr/flexfx/customization_data</b>
has 2 main files:
1. INI
2. Page3

### Explaination 

#### INI.db
Contains a lookup table with the following columns:
1. PartNumber (P/N) - Client specific part number
2. version of the INI file (config_ini_version)- A file that contains various keys for client speicfiications (FW version, OS version and etc)
3. md5sum hash- checksum for the ini file (different clients could have the same ini file)
4. Test name- Name of the test used (just like the case with config.ini file, there can be a 1 to many relation to clients for each test)

in the INI.db it will be displayed:

```bash
{P/N}---{config_ini_version}---{md5sum_hash}---{test_name}
```

To navigate to the PN folder follow the pattern:

```bash
cd /usr/flexfs/customization_data/{PN}/{PN}_{config_ini_version}.INI
```

** IMPORTANT ** - use only the official dbs (INI.db and Page3.db !!!)

#### Concrete example
Go to INI.db:

```vim
692-9K36F-B4MV-JD0---A1---ec8180115f33a4fb18da7a7239a43716---CUSTOM_TANGO_JULIET_AWS_004
692-9K35N-09MV-JQS---A1---0382f93ecda666633043fee9424fe3a5---CUSTOM_TANGO_JULIET_TTM_057
692-9K35P-00MV-JS0---A1---ffc229aadf0f1ca841b7ea00e4858c58---CUSTOM_TANGO_JULIET_TTM_057
692-9K35N-00MV-JQS---A1---ffc229aadf0f1ca841b7ea00e4858c58---CUSTOM_TANGO_JULIET_TTM_057
930-9SPSU-00RA-SS2---A1---220b2f12022d4b340880954ed3ea5e13---CUSTOM_TANGO_PS_CROC_001
```

Take the first PN = "692-9K36F-B4MV-JD0" and go to its INI file:

```bash
cd /usr/flexfs/customization_data/692-9K36F-B4MV-JD0/692-9K36F-B4MV-JD0_A1.INI
```

You will get:

```vim
################################# CPLD REVISION PHASE PARAMETERS #################################

opt_os_bin: "opt-os-sonic_7.0040.1121_for_QS_008_LK6.1.38_x86-64_installer.bin"

onie_version: "5.3.0012-115200"

...
```

#### Page3.db

Database for the config.ini themselves. To search for the specific configuration search by the P/N and the result will be a row containing all relevant data.
The various keys for each configuration is given by PMC.
Each <b>test</b> goes to page3 using the P/N as a key and downloads all the parameters related to this P/N. These parameters will be burned into the EEPROM

#### Partnumber directories
Each partnumber has its own directory in the server (for all environments ?) 

for Partnumber 920-9H24C-00RB-7CB it will be:

```bash
cd 920-9H24C-00RB-7CB
pwd
/usr/flexfs/customization_data/920-9H24C-00RB-7CB
```

For each of such directories there are all the files that will be burned into the EEPROM (except BIOS and OS) and that includes the *.ini file.
This ini file is specific for this partnumber and contains various parameters related to it (Fan speeds, OS, BIOS and etc)