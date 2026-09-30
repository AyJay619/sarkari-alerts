' Runs run-trigger.cmd with no window (started by the scheduled task).
Set fso = CreateObject("Scripting.FileSystemObject")
here = fso.GetParentFolderName(WScript.ScriptFullName)
CreateObject("WScript.Shell").Run """" & here & "\run-trigger.cmd""", 0, True
