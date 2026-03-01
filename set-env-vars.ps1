$token = (Get-Content "C:\Users\Owner\AppData\Roaming\com.vercel.cli\Data\auth.json" | ConvertFrom-Json).token
$teamId = "team_EjGLVhUj3JF7sk8RBnJWk8CD"

$SUPABASE_URL = "https://lvacbxnjfeunouqaskvh.supabase.co"
$ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YWNieG5qZmV1bm91cWFza3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjU5NTEsImV4cCI6MjA4Nzc0MTk1MX0.YXUCjGMdZHK8UcNhO7SCheonDKWjAXE-z-fB8XvLf0c"
$SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YWNieG5qZmV1bm91cWFza3ZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2NTk1MSwiZXhwIjoyMDg3NzQxOTUxfQ.nsqsW-ssYKOYaxrEK-AnY2QeoT6kAKusQR4PibY21Ns"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$projects = @{
    "saucewire" = @{
        id = "prj_yk8WVRmxp7viinZTdQRXN50nb0mg"
        siteUrl = "https://saucewire.com"
    }
    "saucecaviar" = @{
        id = "prj_02BmukMYVslQRCoGLtaq0FkJkzdD"
        siteUrl = "https://saucecaviar.com"
    }
    "trapglow" = @{
        id = "prj_saknmY9aEqiRYsrrjhMN4hK8cC0c"
        siteUrl = "https://trapglow.com"
    }
    "trapfrequency" = @{
        id = "prj_ouMeVYkgSP7kvFDXuTBLP8S65vW6"
        siteUrl = "https://trapfrequency.com"
    }
}

function Add-EnvVar($projectId, $key, $value, $targets) {
    $body = @{
        key = $key
        value = $value
        type = "encrypted"
        target = $targets
    } | ConvertTo-Json
    
    try {
        $resp = Invoke-RestMethod -Uri "https://api.vercel.com/v10/projects/$projectId/env?teamId=$teamId&upsert=true" -Method POST -Headers $headers -Body $body
        Write-Host "  OK: $key -> $($targets -join ',')"
    } catch {
        $err = $_.Exception.Response
        if ($err) {
            $reader = [System.IO.StreamReader]::new($err.GetResponseStream())
            $errBody = $reader.ReadToEnd()
            Write-Host "  WARN: $key - $errBody"
        } else {
            Write-Host "  ERROR: $key - $_"
        }
    }
}

foreach ($name in $projects.Keys) {
    $proj = $projects[$name]
    Write-Host "`n=== $name (${$proj.id}) ==="
    
    $targets = @("production", "preview", "development")
    
    Add-EnvVar $proj.id "NEXT_PUBLIC_SUPABASE_URL" $SUPABASE_URL $targets
    Add-EnvVar $proj.id "NEXT_PUBLIC_SUPABASE_ANON_KEY" $ANON_KEY $targets
    Add-EnvVar $proj.id "SUPABASE_SERVICE_ROLE_KEY" $SERVICE_KEY $targets
    Add-EnvVar $proj.id "NEXT_PUBLIC_SITE_URL" $proj.siteUrl @("production")
}

Write-Host "`nDone setting env vars!"
