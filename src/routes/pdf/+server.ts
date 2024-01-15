import puppeteer from 'puppeteer';

export async function POST({ request }) {
	const form = await request.formData();
	const html = form.get('html') as string;
	console.log(html);

	const browser = await puppeteer.launch({ headless: 'new' });
	const page = await browser.newPage();
	await page.setContent(html);
	await page.emulateMediaType('screen');
	const pdf = await page.pdf({
		format: 'A4',
		printBackground: true,
		margin: { top: 50, right: 50, bottom: 50, left: 50 }
	});
	await browser.close();

	return new Response(pdf, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename=output.pdf'
		}
	});
}
