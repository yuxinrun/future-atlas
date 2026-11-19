$ErrorActionPreference = 'SilentlyContinue'
$dest = Join-Path $PSScriptRoot '..\assets\images'
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest | Out-Null }

$images = @(
  @{ n='hero-earth';   u='https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=80&fit=crop' },
  @{ n='earth-network';u='https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80&fit=crop' },
  @{ n='circuit';      u='https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&fit=crop' },
  @{ n='robot';        u='https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80&fit=crop' },
  @{ n='ai-data';      u='https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1200&q=80&fit=crop' },
  @{ n='city-sky';     u='https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80&fit=crop' },
  @{ n='city-night';   u='https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80&fit=crop' },
  @{ n='city-future';  u='https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80&fit=crop' },
  @{ n='galaxy';       u='https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1400&q=80&fit=crop' },
  @{ n='space-earth';  u='https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=1200&q=80&fit=crop' },
  @{ n='lab-science';  u='https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80&fit=crop' },
  @{ n='data-screen';  u='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80&fit=crop' },
  @{ n='solar';        u='https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80&fit=crop' },
  @{ n='wind';         u='https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1200&q=80&fit=crop' },
  @{ n='nature';       u='https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=1200&q=80&fit=crop' },
  @{ n='books';        u='https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80&fit=crop' },
  @{ n='mars';         u='https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&q=80&fit=crop' },
  @{ n='train';        u='https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&q=80&fit=crop' },
  @{ n='network';      u='https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&fit=crop' },
  @{ n='medicine';     u='https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80&fit=crop' }
)

foreach ($img in $images) {
  $out = Join-Path $dest ($img.n + '.jpg')
  & curl.exe -s -L --max-time 40 -o $out $img.u 2>$null
  if (Test-Path $out) {
    $len = (Get-Item $out).Length
    if ($len -lt 5000) { Write-Output ("FAIL(small) " + $img.n + " " + $len); Remove-Item $out } else { Write-Output ("OK " + $img.n + " " + $len) }
  } else { Write-Output ("FAIL " + $img.n) }
}
