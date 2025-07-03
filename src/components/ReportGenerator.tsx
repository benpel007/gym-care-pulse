
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, Calendar } from "lucide-react";
import { useMaintenanceLog } from "@/hooks/useMaintenanceLog";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import jsPDF from 'jspdf';
import { LogEntry, Equipment } from "@/types";

const ReportGenerator = () => {
  const { logEntries } = useMaintenanceLog();
  const { equipment } = useEquipmentData();
  const [reportType, setReportType] = useState<string>('');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'custom'>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const getFilteredData = () => {
    const now = new Date();
    let fromDate = new Date();

    switch (dateRange) {
      case 'week':
        fromDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        fromDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        fromDate.setMonth(now.getMonth() - 3);
        break;
      case 'custom':
        fromDate = startDate ? new Date(startDate) : new Date(0);
        break;
    }

    const toDate = dateRange === 'custom' && endDate ? new Date(endDate) : now;

    const filteredLogs = logEntries.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= fromDate && logDate <= toDate;
    });

    return { filteredLogs, fromDate, toDate };
  };

  const generatePDF = async (type: string) => {
    setIsGenerating(true);
    
    try {
      const { filteredLogs, fromDate, toDate } = getFilteredData();
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(20);
      doc.text('FitMaintain - Maintenance Report', 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Report Type: ${type.replace('-', ' ').toUpperCase()}`, 20, 35);
      doc.text(`Date Range: ${fromDate.toLocaleDateString()} - ${toDate.toLocaleDateString()}`, 20, 45);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 55);
      
      let yPosition = 70;

      if (type === 'maintenance-summary') {
        // Equipment Status Summary
        doc.setFontSize(16);
        doc.text('Equipment Status Summary', 20, yPosition);
        yPosition += 15;
        
        const statusCounts = equipment.reduce((acc, eq) => {
          acc[eq.status] = (acc[eq.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        doc.setFontSize(12);
        Object.entries(statusCounts).forEach(([status, count]) => {
          doc.text(`${status.toUpperCase()}: ${count} equipment`, 30, yPosition);
          yPosition += 10;
        });

        yPosition += 10;

        // Activity Summary
        doc.setFontSize(16);
        doc.text('Activity Summary', 20, yPosition);
        yPosition += 15;

        const activityCounts = filteredLogs.reduce((acc, log) => {
          acc[log.type] = (acc[log.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        doc.setFontSize(12);
        Object.entries(activityCounts).forEach(([type, count]) => {
          doc.text(`${type.replace('-', ' ').toUpperCase()}: ${count} activities`, 30, yPosition);
          yPosition += 10;
        });

      } else if (type === 'issue-report') {
        // Issues Report
        const issues = filteredLogs.filter(log => log.type === 'issue' || log.priority);
        
        doc.setFontSize(16);
        doc.text('Issues Report', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(12);
        doc.text(`Total Issues: ${issues.length}`, 20, yPosition);
        yPosition += 15;

        issues.forEach((issue, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(12);
          doc.text(`${index + 1}. ${issue.equipmentName || 'General'}`, 20, yPosition);
          yPosition += 10;
          
          doc.setFontSize(10);
          doc.text(`Priority: ${issue.priority || 'N/A'} | Status: ${issue.status}`, 30, yPosition);
          yPosition += 8;
          doc.text(`Staff: ${issue.staff} | Date: ${new Date(issue.timestamp).toLocaleDateString()}`, 30, yPosition);
          yPosition += 8;
          
          const description = doc.splitTextToSize(issue.description, 150);
          doc.text(description, 30, yPosition);
          yPosition += description.length * 6 + 10;
        });

      } else if (type === 'activity-log') {
        // Full Activity Log
        doc.setFontSize(16);
        doc.text('Activity Log', 20, yPosition);
        yPosition += 15;

        doc.setFontSize(12);
        doc.text(`Total Activities: ${filteredLogs.length}`, 20, yPosition);
        yPosition += 15;

        filteredLogs.forEach((log, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(10);
          doc.text(`${new Date(log.timestamp).toLocaleDateString()} - ${log.type.toUpperCase()}`, 20, yPosition);
          yPosition += 8;
          doc.text(`Equipment: ${log.equipmentName || 'N/A'} | Staff: ${log.staff}`, 20, yPosition);
          yPosition += 8;
          
          const description = doc.splitTextToSize(log.description, 170);
          doc.text(description, 20, yPosition);
          yPosition += description.length * 6 + 10;
        });
      }

      // Save the PDF
      const fileName = `FitMaintain_${type}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <FileText className="w-5 h-5" />
          Generate Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance-summary">Maintenance Summary</SelectItem>
                <SelectItem value="issue-report">Issues Report</SelectItem>
                <SelectItem value="activity-log">Full Activity Log</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <Select value={dateRange} onValueChange={(value: 'week' | 'month' | 'quarter' | 'custom') => setDateRange(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {dateRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => generatePDF(reportType)}
            disabled={!reportType || isGenerating}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Download PDF Report'}
          </Button>
          
          <div className="text-sm text-slate-600 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {getFilteredData().filteredLogs.length} activities in selected range
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
