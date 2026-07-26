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
Source: "bepinex_base\*"; DestDir: "{code:GetGameDir}"; Flags: ignoreversion recursesubdirs skipifsourcedoesntexist
Source: "plugin\bin\Release\netstandard2.1\FMAnalyzer.dll"; DestDir: "{code:GetGameDir}\BepInEx\plugins"; Flags: ignoreversion

[Icons]
Name: "{group}\FMAnalyzer"; Filename: "{app}\FMAnalyzer.exe"; IconFilename: "{app}\icon.ico"
Name: "{autodesktop}\FMAnalyzer"; Filename: "{app}\FMAnalyzer.exe"; Tasks: desktopicon; IconFilename: "{app}\icon.ico"

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop shortcut"; GroupDescription: "Additional icons:"

[Code]
var
  GameDirPage: TInputDirWizardPage;

function GetSteamGameInstallLocation(GameName: string): string;
var
  UninstallKeys: TArrayOfString;
  I: Integer;
  DisplayName, InstallLocation: string;
  RootKey: Integer;
  Subkey: string;
begin
  Result := '';
  RootKey := HKEY_LOCAL_MACHINE;
  
  // Check 64-bit registry first
  if RegGetSubkeyNames(RootKey, 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall', UninstallKeys) then
  begin
    for I := 0 to GetArrayLength(UninstallKeys) - 1 do
    begin
      Subkey := 'SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\' + UninstallKeys[I];
      if RegQueryStringValue(RootKey, Subkey, 'DisplayName', DisplayName) then
      begin
        if Pos(GameName, DisplayName) > 0 then
        begin
          if RegQueryStringValue(RootKey, Subkey, 'InstallLocation', InstallLocation) then
          begin
            Result := InstallLocation;
            Exit;
          end;
        end;
      end;
    end;
  end;

  // Check 32-bit registry (WOW6432Node)
  if RegGetSubkeyNames(RootKey, 'SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall', UninstallKeys) then
  begin
    for I := 0 to GetArrayLength(UninstallKeys) - 1 do
    begin
      Subkey := 'SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\' + UninstallKeys[I];
      if RegQueryStringValue(RootKey, Subkey, 'DisplayName', DisplayName) then
      begin
        if Pos(GameName, DisplayName) > 0 then
        begin
          if RegQueryStringValue(RootKey, Subkey, 'InstallLocation', InstallLocation) then
          begin
            Result := InstallLocation;
            Exit;
          end;
        end;
      end;
    end;
  end;
end;

procedure InitializeWizard;
var
  GameDir: string;
begin
  GameDirPage := CreateInputDirPage(wpSelectDir,
    'Select Football Manager 26 Directory', 'Where is Football Manager 26 installed?',
    'Select the folder where Football Manager 26 is installed. This is needed to install the memory reading plugin (FMAnalyzer.dll) so the app can read your live save.',
    False, '');
  GameDirPage.Add('');
  
  GameDir := GetSteamGameInstallLocation('Football Manager 26');
  
  if GameDir = '' then
    GameDir := 'C:\Program Files (x86)\Steam\steamapps\common\Football Manager 26';
    
  GameDirPage.Values[0] := GameDir;
end;

function GetGameDir(Param: String): String;
begin
  Result := GameDirPage.Values[0];
end;
