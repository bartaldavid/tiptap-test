import htmlToPdfmake from 'html-to-pdfmake';
// import pdfMake from 'pdfmake';
import { JSDOM } from 'jsdom';
import { json } from '@sveltejs/kit';
import PdfPrinter from 'pdfmake';
// import pdfMake from 'pdfmake';

export async function POST({ request }) {
	const form = await request.formData();
	const html = form.get('html') as string;

	const pdf = await htmlToPdf(html);

	return new Response(pdf, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="filename.pdf"'
		}
	});
}

async function htmlToPdf(html: string): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const { window } = new JSDOM('');
		const content = htmlToPdfmake(html, { window });

		const printer = new PdfPrinter({
			Helvetica: {
				normal: 'Helvetica',
				bold: 'Helvetica-Bold',
				italics: 'Helvetica-Oblique',
				bolditalics: 'Helvetica-BoldOblique'
			}
		});

		const buffers: Uint8Array[] = [];
		const doc = printer.createPdfKitDocument({ content, defaultStyle: { font: 'Helvetica' } });

		doc.on('data', buffers.push.bind(buffers));
		doc.on('end', () => {
			resolve(Buffer.concat(buffers));
		});
		doc.on('error', (err) => reject(err));
		doc.end();
	});
}
