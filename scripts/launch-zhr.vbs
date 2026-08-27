' ZHR — launcher pulpitu: uruchamia stronę Astro (web/) w przeglądarce.
Option Explicit

Dim fso, sh, scriptDir, root, ps1, cmd

Set fso = CreateObject("Scripting.FileSystemObject")
Set sh = CreateObject("WScript.Shell")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
root = fso.GetParentFolderName(scriptDir)
ps1 = root & "\scripts\launch-zhr-dev.ps1"

If Not fso.FileExists(ps1) Then
  MsgBox "Nie znaleziono launchera:" & vbCrLf & ps1, vbCritical, "ZHR"
  WScript.Quit 1
End If

cmd = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File """ & ps1 & """"
sh.Run cmd, 0, False
