function WaitOnScheduledTask($server = $(throw "Server is required."), $task = $(throw "Task is required."), $maxSeconds = 30000)
{
    $startTime = get-date
    $initialDelay = 3
    $intervalDelay = 5
     
    Write-Output "Starting task '$task' on '$server'. Please wait..."
    schtasks /run /s $server /TN $task
 
    # wait a tick before checking the first time, otherwise it may still be at ready, never transitioned to running
    Write-Output "One moment..."
    start-sleep -s $initialDelay
    $timeout = $false
 
    while ($true)
    {
        $ts = New-TimeSpan $startTime $(get-date)
         
        # this whole csv thing is hacky but one workaround I found for server 2003
        $tempFile = Join-Path $env:temp "SchTasksTemp.csv"
        schtasks /Query /FO CSV /s $server /TN $task /v > $tempFile
 
        $taskData = Import-Csv $tempFile
        $status = $taskData.Status
         
        if($status.tostring() -eq "Running")
        {
            $status = ((get-date).ToString("hh:MM:ss tt") + " Still running '$task' on '$server'...")
            Write-Progress -activity $task -status $status -percentComplete -1 #-currentOperation "Waiting for completion status"
            Write-Output $status
        }
        else
        {
            break
        }
 
        start-sleep -s $intervalDelay  
         
        if ($ts.TotalSeconds -gt $maxSeconds)
        {
            $timeout = $true
            Write-Output "Taking longer than max wait time of $maxSeconds seconds, giving up all hope. Task execution continues but I'm peacing out."
            break
        }
    }
 
    if (-not $timeout)
    {
        $ts = New-TimeSpan $startTime $(get-date)
        "Scheduled task '{0}' on '{1}' complete in {2:###} seconds" -f $task, $server, $ts.TotalSeconds
    }
}

WaitOnScheduledTask "localhost" "Build NodeProd" 
$path = Join-Path -Path $env:WORKSPACE -ChildPath "frontend\dist\prod\index.html"
if(Test-Path -Path $path){
	Write-host "BUILD OK"
} else {
	Write-error "NAO FOI POSSIVEL COMPILAR O NODE"
	throw "ESTA DANDO ALGUM ERRO NA HORA DE RODAR > npm run build.prod e identificar o problema"
}