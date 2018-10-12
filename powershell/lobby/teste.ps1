

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

Function AnalyzeImage($image, $trainDir){
    ReadDissidiaFaces $image        
    $faces = $global:locuura
          
}

$inputImages = "C:\temp\input"
$trainDirectory = "C:\temp\trainFaces" 

gci -Path 'C:\temp\analyzeFace' | foreach {
    AnalyzeImage $_.FullName 'C:\temp\trainFaces'
}
