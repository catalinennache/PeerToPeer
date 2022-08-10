@echo off
echo Installing / updating packages
call npm i
echo:
echo Running tests...
echo:
call npm test
echo:
echo Building...
call npm run build
echo Done!
echo Refer to readme.txt for further instructions.
pause