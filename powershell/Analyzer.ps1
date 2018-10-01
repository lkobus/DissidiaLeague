

Function ReadDissidiaFaces($imagePath) {		
    
	$jobs = @()    
    Write-host ("start time : " + (Get-date))
	for($i = 0;$i -lt 6; $i++){		
        #$jobs += (Start-Job -ScriptBlock (GetScriptBlock) -ArgumentList $BitMap)
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
		    return "Player1TeamA"
	    } elseif($index -eq 1){
		    return "Player2TeamA"
	    }elseif($index -eq 2){
		    return "Player3TeamA"
	    }elseif($index -eq 3){
		    return "Player1TeamB"
	    }elseif($index -eq 4){
		    return "Player2TeamB"
	    } else {
		    return "Player3TeamB"
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
		    return "Player1TeamA"
	    } elseif($index -eq 1){
		    return "Player2TeamA"
	    }elseif($index -eq 2){
		    return "Player3TeamA"
	    }elseif($index -eq 3){
		    return "Player1TeamB"
	    }elseif($index -eq 4){
		    return "Player2TeamB"
	    } else {
		    return "Player3TeamB"
	    }
}

Function AnalyzeImage($image, $trainDir){
    ReadDissidiaFaces $image        
    $faces = $global:locuura
    
    gci -Path $trainDir -Recurse | Where { -Not $_.PSIsContainer } | foreach {
        $character = $_.Directory.Name
        $trainData = Get-Content $_.FullName          
        Write-host ("Checking for : " + $_.FullName)
        $faces.Keys | foreach {
            $currentFace = $faces[$_]        
            $j = Start-Job -ScriptBlock (GetComparingFaceWithTrainBlock)  -ArgumentList $currentFace, $trainData, $image, $character, $_                        
        }   
        Get-Job | Wait-Job     
    }
}

Function GetComparingFaceWithTrainBlock {
    $sb = {
        param($currentFace, $trainData, $image, $character, $ref)
        $resultDir = "C:\temp\resultAnalyze\result.csv"
        Add-Content -Path 'C:\temp\resultAnalyze\analyze.txt' -Value 'strating'
        Add-Content -Path 'C:\temp\resultAnalyze\analyze.txt' -Value $currentFace.Count
        Add-Content -Path 'C:\temp\resultAnalyze\analyze.txt' -Value $trainData.Count
        Function IsPixelMatch($line1, $line2){
            $line1RGB = $line1.Split('-')
            $line2RGB = $line2.Split('-')
            $result = $true
            try {
                for($i =0; $i -lt $line1RGB.Length; $i++){
                    $diff = GetPercentualDiff $line1RGB[$i] $line2RGB[$i]
                    if($diff -gt 2){
                        $result = $false
                        break
                    }
                }
            } catch {
                $wtf = ""
            }
    
            return $result
        }

        Function GetPercentualDiff([int]$value, [int]$value2){
            $maxValue = 255
            $diff = [System.Math]::Abs($value - $value2)
            return (($diff * 100) / $maxValue)
        }

        $howManyMatches = 0
        $howManyDismatches = 0    
        for($i = 0; $i -lt $currentFace.Count; $i++){            
            if(IsPixelMatch $currentFace[$i] $trainData[$i]){            
                $howManyMatches++            
            } else {            
                $howManyDismatches++;
            }
        }    
        Add-Content -Path 'C:\temp\resultAnalyze\analyze.txt' -Value 'adding content'
        $imgBaseName = (gci -Path $image).BaseName
        Add-Content -Path $resultDir -Value ("{0};{1};{2};{3};{4}" -f $imgBaseName, $ref, $character, $howManyMatches, $howManyDismatches)        
    
        
    }
    return $sb
}


$inputImages = "C:\temp\input"
$trainDirectory = "C:\temp\trainFaces" 

gci -Path 'C:\temp\analyzeFace' | foreach {
    AnalyzeImage $_.FullName 'C:\temp\trainFaces'
}

#TrainDissidiaFaces $inputImages $trainDirectory



<#
$r = (ReadDissidiaFaces 'C:\temp\OCR\Dissidia\24-09-2018\5ba987ebcab1200c782945bc.png')

$r.Keys | foreach {
    Add-Content -Path (Join-Path "C:\temp\data" $_ ) -Value $r[$_]
}

#$mainBase = Get-Content "c:\temp\data\Player3TeamB"

#gci -Path "C:\temp\OCR\Dissidia" -Recurse | Where { -Not $_.PSIsContainer } | foreach {
    #$oi = ReadDissidiaFaces $_.FullName
    #$result = ""
#}
#>
