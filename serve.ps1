$port = 3001
$path = "C:\Users\username\Desktop\website"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "ElektroBaas draait op http://localhost:$port" -ForegroundColor Cyan

while ($listener.IsListening) {
    try {
        $ctx  = $listener.GetContext()
        $req  = $ctx.Request
        $res  = $ctx.Response
        $url  = $req.Url.LocalPath
        if ($url -eq '/' -or $url -eq '') { $url = '/index.html' }
        $url  = $url.Replace('/', '\')
        $file = Join-Path $path $url.TrimStart('\')

        if (Test-Path $file -PathType Leaf) {
            $ext  = [System.IO.Path]::GetExtension($file).ToLower()
            $mime = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.css'  { 'text/css' }
                '.js'   { 'application/javascript' }
                '.jpeg' { 'image/jpeg' }
                '.jpg'  { 'image/jpeg' }
                '.png'  { 'image/png' }
                '.svg'  { 'image/svg+xml' }
                '.mp4'  { 'video/mp4' }
                default { 'application/octet-stream' }
            }
            $bytes = [System.IO.File]::ReadAllBytes($file)
            $res.ContentType   = $mime
            $res.ContentLength64 = $bytes.LongLength
            try {
                $res.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch { }
        } else {
            $res.StatusCode = 404
            $body  = [System.Text.Encoding]::UTF8.GetBytes('404 - Niet gevonden')
            $res.ContentLength64 = $body.LongLength
            $res.OutputStream.Write($body, 0, $body.Length)
        }
        try { $res.OutputStream.Close() } catch { }
    } catch { }
}
