export const htmlTemplate = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8" />
    <title>{{TITLE}}</title>
    <link rel="stylesheet" href="/css/calendarAuthStatus.css" />
</head>
<body>
    <div class="card">
        <div class="icon {{ICON_CLASS}}">{{ICON}}</div>
        <h1>{{TITLE}}</h1>
        <p>{{MESSAGE}}</p>
    </div>
</body>
</html>`;