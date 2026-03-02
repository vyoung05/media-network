$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YWNieG5qZmV1bm91cWFza3ZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjE2NTk1MSwiZXhwIjoyMDg3NzQxOTUxfQ.nsqsW-ssYKOYaxrEK-AnY2QeoT6kAKusQR4PibY21Ns"
$headers = @{ "apikey" = $key; "Authorization" = "Bearer $key" }
$tables = @("gear_reviews", "tutorials", "newsletter_subscribers", "newsletter_campaigns", "newsletter_settings", "rss_feeds", "magazine_issues", "magazine_pages", "social_share_log", "notifications", "content_queue", "seo_scores", "hot_or_not_tracks")
foreach ($t in $tables) {
  try {
    $r = Invoke-RestMethod -Uri "https://lvacbxnjfeunouqaskvh.supabase.co/rest/v1/$t`?select=*&limit=1" -Headers $headers -ErrorAction Stop
    Write-Output "TABLE: $t"
    if ($r -and $r.Count -gt 0) { 
      $r[0].PSObject.Properties.Name -join ", " 
    } else { 
      Write-Output "(empty table)" 
    }
  } catch {
    Write-Output "TABLE: $t - ERROR: $($_.Exception.Message)"
  }
  Write-Output ""
}
