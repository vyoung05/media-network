$file = "D:\Vector\media-network\apps\admin\src\app\api\seed-content\route.ts"
$content = Get-Content $file -Raw

# We need to replace genre/mood only in the artists section (after line ~888 "const artists")
# The beats section correctly uses genre (singular) since that's the actual column name
# Artists need genres (plural) and moods (plural)

# Split content at the artists section marker
$artistsStart = $content.IndexOf("// ======================== ARTISTS DATA")
if ($artistsStart -eq -1) {
    Write-Output "Could not find ARTISTS DATA marker"
    exit 1
}

$beforeArtists = $content.Substring(0, $artistsStart)
$artistsAndAfter = $content.Substring($artistsStart)

# In the artists section, replace "    genre: [" with "    genres: [" and "    mood: [" with "    moods: ["
$artistsAndAfter = $artistsAndAfter -replace '(\s+)genre: \[', '$1genres: ['
$artistsAndAfter = $artistsAndAfter -replace '(\s+)mood: \[', '$1moods: ['

$newContent = $beforeArtists + $artistsAndAfter
Set-Content $file -Value $newContent -NoNewline

Write-Output "Fixed genre -> genres and mood -> moods in artists seed data"

# Verify
$check = Select-String -Path $file -Pattern '^\s+genre: \[|^\s+mood: \['
if ($check) {
    Write-Output "WARNING: Still found genre/mood arrays:"
    $check | ForEach-Object { Write-Output $_.Line }
} else {
    Write-Output "All artist genre/mood references fixed!"
}
