[Setup]
AppName=FMAnalyzer
AppVersion=1.0.6
DefaultDirName={localappdata}\FMAnalyzer
DefaultGroupName=FMAnalyzer
OutputBaseFilename=FMAnalyzer-Setup
SetupIconFile=icon.ico
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=lowest
OutputDir=dist-setup

[Files]
Source: "icon.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "FMAnalyzer.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "plugin\bin\Release\win-x64\publish\FMAnalyzerScanner.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\FMAnalyzer"; Filename: "{app}\FMAnalyzer.exe"; IconFilename: "{app}\icon.ico"
Name: "{autodesktop}\FMAnalyzer"; Filename: "{app}\FMAnalyzer.exe"; Tasks: desktopicon; IconFilename: "{app}\icon.ico"

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop shortcut"; GroupDescription: "Additional icons:"

