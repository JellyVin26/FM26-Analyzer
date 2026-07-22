[Setup]
AppName=FMAnalyzer
AppVersion=1.0.0
DefaultDirName={localappdata}\FMAnalyzer
DefaultGroupName=FMAnalyzer
OutputBaseFilename=FMAnalyzer-Setup
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=lowest
OutputDir=dist-setup

[Files]
Source: "FMAnalyzer.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "plugin\bin\Release\netstandard2.1\FMAnalyzer.dll"; DestDir: "{code:GetGameDir}\BepInEx\plugins"; Flags: ignoreversion

[Icons]
Name: "{group}\FMAnalyzer"; Filename: "{app}\FMAnalyzer.exe"
Name: "{autodesktop}\FMAnalyzer"; Filename: "{app}\FMAnalyzer.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop shortcut"; GroupDescription: "Additional icons:"

[Code]
var
  GameDirPage: TInputDirWizardPage;

procedure InitializeWizard;
begin
  GameDirPage := CreateInputDirPage(wpSelectDir,
    'Select Football Manager 2026 Directory', 'Where is Football Manager 2026 installed?',
    'Select the folder where Football Manager 2026 is installed. This is needed to install the memory reading plugin (FMAnalyzer.dll) so the app can read your live save.',
    False, '');
  GameDirPage.Add('');
  // Set default steam path
  GameDirPage.Values[0] := 'C:\Program Files (x86)\Steam\steamapps\common\Football Manager 2026';
end;

function GetGameDir(Param: String): String;
begin
  Result := GameDirPage.Values[0];
end;
