'use client';

import React, { useState } from 'react';
import { useResearch } from '@/lib/storage/context';
import { Bookmark, Trash2, Download, Copy, Check, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import Papa from 'papaparse';
import * as ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';

export default function CollectionPage() {
  const { collection, removeFromCollection, updateCollectionNote, clearCollection, numberFormat } = useResearch();
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'excel' | 'word' | 'csv'>('excel');
  const [includeReferences, setIncludeReferences] = useState(true);
  const [includeDefinitions, setIncludeDefinitions] = useState(true);
  const [includeLimitations, setIncludeLimitations] = useState(true);

  const handleCopyCitation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCitationId(id);
    setTimeout(() => setCopiedCitationId(null), 2000);
  };

  const handleExportCSV = () => {
    const data = collection.map(item => ({
      'Item Label': item.label,
      'Measures': item.measures,
      'Geographic Scope': item.place,
      'Year / Reporting Period': item.year,
      'Recorded Value': item.value,
      'Data Source': item.source,
      'Researcher Note': item.notes,
      'Date Saved': item.addedAt,
      'Citation (APA)': item.citation
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `displacement_explorer_collection_${new Date().toISOString().slice(0, 10)}.csv`);
    setShowExportModal(false);
  };

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Displacement Explorer Academic Platform';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Displacement Data Collection');
    sheet.columns = [
      { header: 'Saved Item', key: 'label', width: 32 },
      { header: 'Measures', key: 'measures', width: 24 },
      { header: 'Location', key: 'place', width: 18 },
      { header: 'Year / Period', key: 'year', width: 16 },
      { header: 'Value', key: 'value', width: 16 },
      { header: 'Source', key: 'source', width: 30 },
      { header: 'My Research Note', key: 'notes', width: 35 },
      { header: 'Academic Citation', key: 'citation', width: 50 },
    ];

    collection.forEach(item => {
      sheet.addRow({
        label: item.label,
        measures: item.measures,
        place: item.place,
        year: item.year,
        value: item.value,
        source: item.source,
        notes: item.notes,
        citation: item.citation
      });
    });

    // Style header row
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E293B' }
    };

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `displacement_explorer_collection_${new Date().toISOString().slice(0, 10)}.xlsx`);
    setShowExportModal(false);
  };

  const handleExportWord = async () => {
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Measure', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Place', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Year', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Value', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Source', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Notes', bold: true })] })] }),
        ]
      }),
      ...collection.map(item => new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: item.label })] }),
          new TableCell({ children: [new Paragraph({ text: item.place })] }),
          new TableCell({ children: [new Paragraph({ text: String(item.year) })] }),
          new TableCell({ children: [new Paragraph({ text: item.value })] }),
          new TableCell({ children: [new Paragraph({ text: item.source })] }),
          new TableCell({ children: [new Paragraph({ text: item.notes || '—' })] }),
        ]
      }))
    ];

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: 'Displacement Explorer — Research Collection', bold: true, size: 32 }),
            ],
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: `Generated: ${new Date().toLocaleDateString()} | Total Pinned Figures: ${collection.length}`,
            spacing: { after: 300 }
          }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),
          ...(includeReferences ? [
            new Paragraph({ children: [new TextRun({ text: 'Academic References & Citations', bold: true, size: 24 })], spacing: { before: 400, after: 150 } }),
            ...collection.map(item => new Paragraph({ text: `• ${item.citation}`, spacing: { after: 100 } }))
          ] : [])
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `displacement_explorer_collection_${new Date().toISOString().slice(0, 10)}.docx`);
    setShowExportModal(false);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleExecuteExport = () => {
    if (exportFormat === 'excel') handleExportExcel();
    else if (exportFormat === 'word') handleExportWord();
    else handleExportCSV();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Page Header (Sketch 13) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-blue-600">
            Research Notebook
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight mt-1">
            My Collection: Key-Numbers Table
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {collection.length} items pinned · Saved locally in your browser
          </p>
        </div>

        {collection.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 px-3 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-700 hover:bg-stone-50 transition"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Export Collection &rarr;</span>
            </button>
          </div>
        )}
      </div>

      {collection.length === 0 ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl p-8 space-y-4">
          <Bookmark className="w-12 h-12 text-stone-300 mx-auto" />
          <h2 className="text-lg font-bold text-stone-800">Your research collection is empty</h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
            While researching situations or exploring numbers across the site, click the bookmark icon or "Add to Collection" to pin verified numbers and citations here.
          </p>
        </div>
      ) : (
        /* The Structured Collection Table (Sketch 13) */
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden text-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-stone-200">
              <thead className="bg-stone-50 font-mono text-stone-600 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Number</th>
                  <th className="p-4">What it measures</th>
                  <th className="p-4">Place</th>
                  <th className="p-4">Year</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">My Note</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {collection.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition">
                    <td className="p-4 font-mono font-bold text-sm text-blue-700 whitespace-nowrap">
                      {item.value}
                    </td>
                    <td className="p-4 font-medium text-stone-900">
                      {item.label}
                    </td>
                    <td className="p-4 text-stone-600 font-mono">
                      {item.place}
                    </td>
                    <td className="p-4 text-stone-600 font-mono">
                      {item.year}
                    </td>
                    <td className="p-4 text-stone-500 text-[11px]">
                      {item.source}
                    </td>
                    <td className="p-4 max-w-xs">
                      <input
                        type="text"
                        defaultValue={item.notes}
                        placeholder="Add a researcher note..."
                        onBlur={(e) => updateCollectionNote(item.id, e.target.value)}
                        className="w-full px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleCopyCitation(item.id, item.citation)}
                        className="p-1.5 text-stone-400 hover:text-blue-600 transition"
                        title="Copy APA Citation"
                      >
                        {copiedCitationId === item.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => removeFromCollection(item.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition"
                        title="Remove from Collection"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* References & Citations section (Sketch 13) */}
          <div className="p-6 bg-stone-50 border-t border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-stone-900">
                References (APA Format)
              </h3>
              <button
                onClick={clearCollection}
                className="text-[11px] text-red-600 hover:underline"
              >
                Clear all saved items
              </button>
            </div>
            <div className="space-y-2 text-xs text-stone-600 font-mono">
              {collection.map((item, i) => (
                <div key={i} className="leading-relaxed">
                  • {item.citation}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Export Modal Dialog (Sketch 14) */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-6 text-sm">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Export Research Collection
              </h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            {/* Export Format (Sketch 14) */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                FORMAT
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50">
                  <input
                    type="radio"
                    name="format"
                    checked={exportFormat === 'excel'}
                    onChange={() => setExportFormat('excel')}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-bold text-xs text-stone-900">Excel (.xlsx)</div>
                    <div className="text-[11px] text-stone-500">Structured spreadsheet with column styling</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50">
                  <input
                    type="radio"
                    name="format"
                    checked={exportFormat === 'word'}
                    onChange={() => setExportFormat('word')}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-bold text-xs text-stone-900">Word (.docx)</div>
                    <div className="text-[11px] text-stone-500">Research-ready table with bibliographic appendix</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50">
                  <input
                    type="radio"
                    name="format"
                    checked={exportFormat === 'csv'}
                    onChange={() => setExportFormat('csv')}
                    className="text-blue-600"
                  />
                  <div>
                    <div className="font-bold text-xs text-stone-900">CSV (.csv)</div>
                    <div className="text-[11px] text-stone-500">Raw tabular format for R, Python, and Stata</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Include Checkboxes (Sketch 14) */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                INCLUDE IN FILE
              </span>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeReferences}
                    onChange={(e) => setIncludeReferences(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Full academic references list (APA)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDefinitions}
                    onChange={(e) => setIncludeDefinitions(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Definitions and measurement criteria</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLimitations}
                    onChange={(e) => setIncludeLimitations(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>Data limitations and notes</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteExport}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition"
              >
                Download Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
