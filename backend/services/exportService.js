const PDFDocument = require('pdfkit');

const toCSV = (rows, headers) => {
  const escape = (val) => {
    const str = String(val ?? '');
    return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = [headers.map(escape).join(',')];
  rows.forEach((row) => lines.push(headers.map((h) => escape(row[h])).join(',')));
  return lines.join('\n');
};

const attendanceToCSV = (records) => {
  const headers = ['date', 'student', 'course', 'status', 'method', 'confidence'];
  const rows = records.map((r) => ({
    date: new Date(r.date).toISOString().split('T')[0],
    student: r.student?.profile?.fullName || r.student?.username || r.student,
    course: r.course?.code || r.course,
    status: r.status,
    method: r.method,
    confidence: r.confidence != null ? r.confidence.toFixed(2) : '',
  }));
  return toCSV(rows, headers);
};

const attendanceToPDF = (records, meta = {}) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).fillColor('#e11d48').text('Attendrix AI', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('#333').text(meta.title || 'Attendance Report', { align: 'center' });
    doc.moveDown(1);

    records.forEach((r, i) => {
      const line = `${new Date(r.date).toLocaleDateString()} | ${r.student?.profile?.fullName || 'Student'} | ${r.course?.code || ''} | ${r.status} | ${r.confidence != null ? (r.confidence * 100).toFixed(0) + '%' : '—'}`;
      doc.fontSize(10).fillColor('#111').text(line);
      if (i < records.length - 1) doc.moveDown(0.3);
    });

    doc.end();
  });

module.exports = { attendanceToCSV, attendanceToPDF, toCSV };
