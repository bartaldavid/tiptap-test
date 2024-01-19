// place files you want to import through the `$lib` alias in this folder.

export function htmlBoilerPlate(content:string) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <main>
            ${content}
        </main>
    </body>
    </html>`
}