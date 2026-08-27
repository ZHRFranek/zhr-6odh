' ZHR — stary launcher: otwiera statyczny mockup HTML z folderu strona/ (archiwum).
Option Explicit

Dim fso, sh, scriptDir, root, stronaDir, newest, newestDate, folder, file
Dim appData, runDir, stamp, dest, ts, meta, ageHours
Dim galeriaSrc, galeriaDest

Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
root = fso.GetParentFolderName(scriptDir)
stronaDir = root & "\strona"

If Not fso.FolderExists(stronaDir) Then
  MsgBox "Nie znaleziono katalogu strony:" & vbCrLf & stronaDir, vbCritical, "ZHR"
  WScript.Quit 1
End If

newest = ""
newestDate = #1970-01-01#
FindNewestHtml fso.GetFolder(stronaDir)

If newest = "" Then
  MsgBox "Brak pliku HTML w:" & vbCrLf & stronaDir, vbCritical, "ZHR"
  WScript.Quit 1
End If

appData = sh.ExpandEnvironmentStrings("%LOCALAPPDATA%")
If Not fso.FolderExists(appData & "\ZHR") Then fso.CreateFolder appData & "\ZHR"
runDir = appData & "\ZHR\strona-run"
If Not fso.FolderExists(runDir) Then fso.CreateFolder runDir

On Error Resume Next
For Each file In fso.GetFolder(runDir).Files
  If LCase(fso.GetExtensionName(file.Name)) = "html" Then
    ageHours = DateDiff("h", file.DateLastModified, Now)
    If ageHours >= 24 Then file.Delete True
  End If
Next
On Error GoTo 0

stamp = CStr(DateDiff("s", #1970-01-01#, Now)) & Right("000" & CStr(Int((Timer - Int(Timer)) * 1000)), 3)
dest = runDir & "\zhr-" & stamp & ".html"
fso.CopyFile newest, dest, True

galeriaSrc = stronaDir & "\galeria"
galeriaDest = runDir & "\galeria"
If fso.FolderExists(galeriaSrc) Then
  CopyFolder galeriaSrc, galeriaDest
End If

On Error Resume Next
meta = runDir & "\latest.txt"
Set ts = fso.CreateTextFile(meta, True)
ts.WriteLine "openedAt=" & Now
ts.WriteLine "source=" & newest
ts.WriteLine "opened=" & dest
ts.Close
On Error GoTo 0

sh.Run """" & dest & """", 1, False

Sub FindNewestHtml(fld)
  Dim f, sf
  For Each f In fld.Files
    If LCase(fso.GetExtensionName(f.Name)) = "html" Then
      If f.DateLastModified > newestDate Then
        newestDate = f.DateLastModified
        newest = f.Path
      ElseIf f.DateLastModified = newestDate Then
        If LCase(f.Name) = "index.html" Then newest = f.Path
      End If
    End If
  Next
  For Each sf In fld.SubFolders
    FindNewestHtml sf
  Next
End Sub

Sub CopyFolder(source, dest)
  Dim folder, subfolder, copyFile
  If Not fso.FolderExists(dest) Then fso.CreateFolder dest
  Set folder = fso.GetFolder(source)
  For Each copyFile In folder.Files
    fso.CopyFile copyFile.Path, dest & "\" & copyFile.Name, True
  Next
  For Each subfolder In folder.SubFolders
    CopyFolder subfolder.Path, dest & "\" & subfolder.Name
  Next
End Sub
