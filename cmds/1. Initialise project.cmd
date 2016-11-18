@echo off
cd ../
echo(
echo        **************************************
echo(
echo          Installing dependancies through npm
echo(
echo        **************************************
echo(
Call cmds\bat\initialise_npm.bat
echo(
echo        **************************************
echo(
echo                       Complete
echo(
echo        **************************************
echo(    
echo        **************************************
echo(
echo        Installing dependancies through bower
echo(
echo        **************************************
echo(
Call cmds\bat\initialise_bower.bat
echo(          
echo        **************************************
echo(
echo                       Complete
echo(
echo        **************************************
echo(     
echo        **************************************
echo(
echo                   Build dist files
echo(
echo        **************************************
echo(
call gulp build-production
echo(
echo        **************************************
echo(
echo                       Complete
echo(
echo        **************************************
echo(   
echo        **************************************
echo(
echo         The project should be ready to go :)
echo(
echo        **************************************
echo(
@echo on