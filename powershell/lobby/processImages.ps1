Function SplitScoreInformations ($fileName, $outputdir) {		
	$imageMagickPath = $global:imageMagickPath
	if(Test-Path $outputdir){
		Remove-Item -Path $outputdir -Force -Recurse
	}	
	md $outputdir		
	$arguments = @()
	$arguments += "-crop 160x50+520+250 $fileName " + (Join-Path -Path $outputdir -ChildPath score-player-1-team-a.jpg)
	$arguments += "-crop 160x35+565+375 $fileName " + (Join-Path -Path $outputdir -ChildPath score-player-2-team-a.jpg)
	$arguments += "-crop 160x40+600+480 $fileName " + (Join-Path -Path $outputdir -ChildPath score-player-3-team-a.jpg)

	$arguments += "-crop 160x50+1340+260 $fileName " + (Join-Path -Path $outputdir -ChildPath score-player-1-team-b.jpg)
	$arguments += "-crop 160x40+1300+375 $fileName " + (Join-Path -Path $outputdir -ChildPath score-player-2-team-b.jpg)
	$arguments += "-crop 160x40+1250+480 $fileName " + (Join-Path -Path $outputdir -ChildPath score-player-3-team-b.jpg)	
	$arguments += "-crop 380x40+30+140 $fileName " + (Join-Path -Path $outputdir -ChildPath result-team-a.jpg)
	
	$arguments += "-crop 300x28+350+225 $fileName " + (Join-Path -Path $outputdir -ChildPath nickname-player-1-team-a.jpg)
	$arguments += "-crop 300x28+1250+225 $fileName " + (Join-Path -Path $outputdir -ChildPath nickname-player-1-team-b.jpg)

	$arguments += "-crop 300x28+350+225 $fileName " + (Join-Path -Path $outputdir -ChildPath nickname-player-1-team-a.jpg)
	$arguments += "-crop 300x28+1250+225 $fileName " + (Join-Path -Path $outputdir -ChildPath nickname-player-1-team-b.jpg)
	$arguments += "-crop 285x28+1210+338 $fileName " + (Join-Path -Path $outputdir -ChildPath nickname-player-2-team-b.jpg)	
	$arguments += "-crop 280x28+375+338 $fileName " + (Join-Path -Path $outputdir -ChildPath nickname-player-2-team-a.jpg)		
	$arguments += "-crop 280x28+446+450 $fileName " + (Join-Path -Path $outputdir -ChildPath nickname-player-3-team-a.jpg)	
	$arguments += "-crop 280x28+1180+450 $fileName " + (Join-Path -Path $outputdir -ChildPath nickname-player-3-team-b.jpg)	
	
	
	$arguments | Foreach {	
		Invoke-Expression ("cmd /C ""$imageMagickPath"" " + $_)
	}
}

Function SplitCharacterInformation($fileName, $outputDir) {
    $imageMagickPath = $global:imageMagickPath	
    $id = [System.Guid]::NewGuid().ToString()
	md $outputdir		
	$arguments = @()
	$arguments += "-crop 165x88+157+211 $fileName " + (Join-Path -Path $outputdir -ChildPath "$id.jpg")
    $id = [System.Guid]::NewGuid().ToString()
	$arguments += "-crop 165x88+197+324 $fileName " + (Join-Path -Path $outputdir -ChildPath "$id.jpg")
    $id = [System.Guid]::NewGuid().ToString()
	$arguments += "-crop 165x88+245+436 $fileName " + (Join-Path -Path $outputdir -ChildPath "$id.jpg")
    $id = [System.Guid]::NewGuid().ToString()
	$arguments += "-crop 165x88+1595+211 $fileName " + (Join-Path -Path $outputdir -ChildPath "$id.jpg")
    $id = [System.Guid]::NewGuid().ToString()
	$arguments += "-crop 165x88+1541+324 $fileName " + (Join-Path -Path $outputdir -ChildPath "$id.jpg")
    $id = [System.Guid]::NewGuid().ToString()
	$arguments += "-crop 165x88+1509+436 $fileName " + (Join-Path -Path $outputdir -ChildPath "$id.jpg")
	
	$arguments | Foreach {
		Invoke-Expression ("cmd /C ""$imageMagickPath"" " + $_)
	}
}

Function AplicarFiltroParaLer ($outputdir) { 
    cd $outputdir
	$imageMagickPath = $global:imageMagickPath
	
	gci -Path '.' | Foreach {			
		if($_.FullName -match 'result-team-a.jpg'){
			$arguments = ($_.Name + " -colorspace gray -auto-level -threshold 36% " + ('filtered.' + $_.Name))			
		} else {
			$arguments = ($_.Name + " -colorspace gray -auto-level -threshold 75% " + ('filtered.' + $_.Name))			
		}
		
		Invoke-Expression "cmd /C ""$imageMagickPath"" $arguments"
	}
}

Function RunTesseract($outputdir, $resultadoTesseract) {
    cd $outputdir
    $tessDataDir = "C:\Users\leonardo.kobus\Desktop\lobby\tessdata"	

	if(Test-Path $resultadoTesseract){
		Remove-Item -Path $resultadoTesseract -Force -Recurse
	}
	md $resultadoTesseract	
	
	gci -Path $outputdir | Foreach {
		if($_.Name -match 'filtered'){
			$outputFile = Join-Path -Path $resultadoTesseract -ChildPath $_.Name			
			$arguments =  ($_.Name + " -l eng $outputFile --oem 1")			
			Invoke-Expression "cmd /C tesseract $arguments"	
		}
		
	}
}

Function RunRecognition($image, $outputDir, $trainData, $inputDir){
	ReadDissidiaFaces $image
	& "C:\bin\face\Dissidia.League.App.Helper.FaceRecognition.exe" $inputDir $trainData $outputDir
}

Function AplicarTesseract($outputdir, $resultadoTesseract) {
	$currentMatch = $global:currentMatch    
	$pontuationsResults = @()
    $characterResults = @()
	$psnIdsResults = @()	
	gci -Path $resultadoTesseract | Foreach {		
		$fileInfo = GetFileInformation $_.Name
		$content = Get-Content -Path $_.FullName.ToString()
		if($_.Name -match "filtered.score-player"){						
			$points = $content.Replace(" ", "").Replace("l", "1")		
			$userPoints = $points -replace '[^\d]'									
			$pontuationsResults += FactoryDissidiaPontuation $userPoints $fileInfo.Team $fileInfo.Position		
		} elseif($_.Name -match 'filtered.result-team'){			
            $winner = "n"
            if($content.Length -gt 0){
                Add-Content -Path "C:\temp\resultadoPartida.csv" -Value ("{0};{1}" -f $currentMatch, $content[0].ToUpper())
                if($content[0].ToUpper() -match "DEFE"){                    
                    $winner = "b"
                } else {
                    $winner = "a"
                }
            }
            
			$matchResult = FactoryDissidiaMatch $winner $fileInfo.Team $currentMatch
		} elseif($_.Name -match 'face.player'){
            $characterResults += FactoryCharacterInformation $fileInfo.Team $fileInfo.Position $content
        } else {
			$psnIdsResults += FactoryDissidiaPSNId $content $fileInfo.Team $fileInfo.Position
		}			
	}		
	
	$teamAPontuation = @()
	$teamBPontuation = @()
		
	$pontuationsResults | Foreach {
		$p = $_
		$i = ($psnIdsResults | Where { ($_.Team -eq $p.Team) -and $_.Position -eq $p.Position }).PSNId
        $c = ($characterResults | Where { ($_.Team -eq $p.Team) -and $_.Position -eq $p.Position }).Character
        
		$pontuation = CreateUserPontuation $i $_.Pontuation $c
		if($p.Team -match 'a'){				
			$teamAPontuation += $pontuation
		} else {
			$teamBPontuation += $pontuation
		}
	}
	
	$matchEntity = CreateMatchEntity $currentMatch $matchResult.Winner $teamAPontuation $teamBPontuation
	PrintMatchEntity $matchEntity
    return $matchEntity
}	

Function PrintMatchEntity ($matchEntity) {
    Write-Host "###################################################################"
	Write-Host "###################################################################"
	Write-Host "###################################################################"       

	Write-host : "WINNER : " $matchEntity.Winner.ToUpper()
	Write-Host "################# TEAM A ###################"
	$matchEntity.TeamA | foreach {
		Write-Host "NAME : " + $_.PSNId + " - PONTUATION " + $_.Pontuation
	}
	Write-Host "###############################################"
	Write-Host "################# TEAM B ###################"
	$matchEntity.TeamB | foreach {
		Write-Host "NAME : " + $_.PSNId + " - PONTUATION " + $_.Pontuation
	}
	Write-Host "###############################################"
}

Function GetFileInformation ($fileName) {
	$splitted = $fileName.Split('-')
	
	if($splitted.Count -gt 4){
		return FactoryFileInformation $splitted[4] $splitted[2]
	} elseif ($splitted.Count -gt 3) {
        return FactoryFileInformation $splitted[3] $splitted[1]
    }    
     else {
		return FactoryFileInformation $splitted[2] $splitted[2]
	}
}

Function CreateMatchEntity ($matchId, $winner, $teamAPontuations, $teamBPontuations){
	$dict = @{		
		MatchId = $matchId
		Winner = $winner
		TeamA = $teamAPontuations
		TeamB = $teamBPontuations
	}
	return New-Object PSObject -Property $dict
}

Function CreateUserPontuation ($psnId, $pontuation, $character) {
    if($character -eq $null){
        $character = "UNDEFINED"
    }
	$dict = @{		
		PSNId = $psnId[0]
		Pontuation = $pontuation[0]
        Character = $character.ToUpper()
	}
	return New-Object PSObject -Property $dict
}

Function FactoryFileInformation ($team, $position) {
	$dict = @{		
		Team = $team.Split('.')[0]
		Position = $position
	}
	return New-Object PSObject -Property $dict
}

Function FactoryCharacterInformation ($team, $position, $character) {
	$dict = @{		
		Character = $character
		Position = $position
        Team = $team
	}
	return New-Object PSObject -Property $dict
}

Function FactoryDissidiaPSNId ($psnId, $team, $position) {
	$dict = @{
		PSNId = $psnId
		Team = $team	
		Position = $position
	}
	return New-Object PSObject -Property $dict
}

Function FactoryDissidiaPontuation ($pontuation, $team, $position){
	$dict = @{
		Pontuation = $pontuation
		Team = $team		
		Position = $position
	}
	return New-Object PSObject -Property $dict
}

Function FactoryDissidiaMatch ($win, $team, $id){		    
	$dict = @{
		Id = $id
		Team = $team
		Winner = $win
	}
	return New-Object PSObject -Property $dict
}

Function Main {
    $baseDir = "C:\Users\leonardo.kobus\Desktop\lobby"
    $global:imageMagickPath = "C:\PROGRA~1\ImageMagick-7.0.8-Q16\convert"
    $outputdir = "C:\Users\leonardo.kobus\Desktop\lobby\image"
    $inputFolder = "C:\Users\leonardo.kobus\Desktop\lobby\input"
    $recognitionInputDir = "C:\tmp\recognition\input"
    $recognitionOutputDir = "C:\tmp\recognition\output"
    
    gci $outputdir | foreach { Remove-Item -Path $_ -Force -Recurse }
    gci $inputFolder -File | Rename-Item -NewName { $_.Name -replace ' ','' }
    $rr = @()
    gci -Path $inputFolder | Foreach {
        try {
            $global:currentMatch = (Select-String -Path $_.FullName -Pattern '\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2}' | % { $_.Matches } | % { $_.Value})[0]
        } catch {
            $global:currentMatch = (Get-Date).ToString("yyyy:MM:dd HH:mm:ss")
        }        

        $oi = (ProcessMatch $_.FullName $outputdir)
        #SplitCharacterInformation $_.FullName $recognitionInputDir
        $oi | Foreach {
            if($_.GetType().Name -match 'PSCustomObject'){
                $rr += $_
            }
        }        
        cd $baseDir
    }
    ExportMatchesToCSV $rr
}

Function ExportMatchesToCSV ($matchesResults) {
    $exportDir = "C:\Users\leonardo.kobus\Desktop\lobby\result"
    if(-Not (Test-Path -Path $exportDir)){
        md $exportDir
    }
    $fileToExport = Join-Path -Path $exportDir -ChildPath "matches.csv"
    $header = "matchId;Winner;Player;Points;Character"
    $mask = "{0};{1};{2};{3};{4}"
    $lines = @()
    $matchesResults | Foreach {     
        try{
            $contador = 0
            while($contador -lt 3){
                $w = "Derrota"
                if($_.Winner -match 'a'){
                    $w = "Vitoria"
                }
                $lines += $mask -f $_.MatchId, $w, $_.TeamA[$contador].PSNId, $_.TeamA[$contador].Pontuation, $_.TeamA[$contador].Character
                $contador++
            }
            $contador = 0
            while($contador -lt 3){
                $w = "Derrota"
                if($_.Winner -match 'b'){
                    $w = "Vitoria"
                }
                $lines += $mask -f $_.MatchId, $w, $_.TeamB[$contador].PSNId, $_.TeamB[$contador].Pontuation, $_.TeamB[$contador].Character
                $contador++
            }                      
        } catch{
            $parei = ""
        }
        
    }
    Clear-Content $fileToExport
    Add-Content -Path $fileToExport -Value $header
    $lines | Foreach { Add-Content -Path $fileToExport -Value $_ }
}


Function ProcessMatch($fileName, $outputdir) {        
    SplitScoreInformations $fileName $outputdir
    Start-Sleep -s 1
    AplicarFiltroParaLer $outputdir
    Start-Sleep -s 1
    $resultadoTesseract = Join-Path -Path $outputdir -ChildPath "data"	
	RunTesseract $outputdir $resultadoTesseract    
    Start-Sleep -s 1	
	RunRecognition $fileName ($outputdir + "\data") "C:\temp\trainFaces" "C:\temp\running"
    #TODO: aplicar a rotina acima no AplicarTesseract
    #apos isso fazer exportação dele no result.csv
    $r = AplicarTesseract $outputdir $resultadoTesseract        
    return $r
}

Function ReadDissidiaFaces($imagePath) {		    
	$jobs = @()    
    Write-host ("start time : " + (Get-date))
	for($i = 0;$i -lt 6; $i++){		        
        $j = Start-Job -Name (GetPlayerInfoByIndex $i) -ScriptBlock (GetScriptBlock)  -ArgumentList $imagePath, $i
	}    

    Get-Job | Wait-Job
    Write-host ("end time : " + (Get-date))
    $locuura = @{}
    gci -Path 'C:\temp\running' | foreach {
        $content = Get-Content $_.FullName
        $locuura.Add($_.Name, $content)
    }    
    $global:locuura = $locuura
	return $locuura
}

Function GetScriptBlock {
    $sb = {
    param($imagePath, $index)
    [void] [System.Reflection.Assembly]::LoadWithPartialName("System.Drawing") 
	[void] [System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms")		
    
    Function GetTemplate($imagePath, $index) {                    
	    $BitMap = [System.Drawing.Bitmap]::FromFile((Resolve-Path $imagePath).ProviderPath)
        $executionId = GetPlayerInfoByIndex $index
        
        $path = "C:\temp\running\$executionId"
        if(-Not (Test-Path -Path "C:\temp\running" )){
            md "C:\temp\running"
        }       
        $imageWidth = 151
	    $imageHeight = 70
        $heights = GetFacesHeights
	    $widths = GetFacesWidths	               	           	            
        $passei = @()      
        $rgbList = @()
	    foreach($w in $widths[$index]..($widths[$index]+$imageWidth)){
		    foreach($h in $heights[$index]..($heights[$index]+$imageHeight)) {		    
		        Try {
                    $passei += ("$w,$h")                                        
			        $px = $BitMap.GetPixel($w - 1,$h - 1)                                
                    $rgbList += ($px.R.ToString() + "-" + $px.G.ToString() + "-" + $px.B.ToString())		    			        
		        } catch {                                    
			        $oi = ""
		        }
		
		    }
	    }		        	       
        [System.IO.File]::WriteAllLines($path, $rgbList)
    }
    Function GetPlayerInfoByIndex($index){
	    if($index -eq 0){
		    return "player-1-team-a"
	    } elseif($index -eq 1){
		    return "player-2-team-a"
	    }elseif($index -eq 2){
		    return "player-3-team-a"
	    }elseif($index -eq 3){
		    return "player-1-team-b"
	    }elseif($index -eq 4){
		    return "player-2-team-b"
	    } else {
		    return "player-3-team-b"
	    }
    }

    Function GetFacesHeights {
	    $result = @()	
	    $result += 224
	    $result += 337
	    $result += 450
	    $result += 224
	    $result += 337
	    $result += 450
	    return $result	
    }

    Function GetFacesWidths {
	    $result = @()	
	    $result += 165
	    $result += 206
	    $result += 246
	    $result += 1604
	    $result += 1564
	    $result += 1524	
	    return $result	
    }

    GetTemplate $imagePath $index
    }
    return $sb
}


Function TrainDissidiaFaces($inputImages, $outputDir){
    if(-Not (Test-Path $inputImages)) { md $inputImages }
    if(-Not (Test-Path $outputDir)) { md $outputDir }
    
    gci -Path $inputImages | Where { $_.PSIsContainer }  | foreach {        
        ReadDissidiaFaces (gci -Path $_.FullName).FullName
        $destinationPath = (Join-Path -Path $outputDir -ChildPath $_.BaseName)
        if(-Not (Test-Path $destinationPath)) { md $destinationPath }
        gci -Path 'C:\temp\running\' | foreach {
            Copy-Item -Path $_.FullName -Destination (Join-Path $destinationPath ($_.Name + ".data")) -Force           
        }
    }
                
}


Function GetPlayerInfoByIndex($index){
	if($index -eq 0){
		return "player-1-team-a"
	} elseif($index -eq 1){
		return "player-2-team-a"
	}elseif($index -eq 2){
		return "player-3-team-a"
	}elseif($index -eq 3){
		return "player-1-team-b"
	}elseif($index -eq 4){
		return "player-2-team-b"
	} else {
		return "player-3-team-b"
	}
}

Main


