
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

interface MaintenanceCalendarProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  datesWithMaintenance: Date[];
}

const MaintenanceCalendar = ({ selectedDate, onSelectDate, datesWithMaintenance }: MaintenanceCalendarProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <CalendarDays className="w-5 h-5 text-blue-600" />
          Maintenance Calendar
        </CardTitle>
        <CardDescription className="text-sm">
          Select a date to view or schedule maintenance
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <div className="overflow-x-auto">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            className="rounded-md border border-slate-200 p-1 sm:p-3 pointer-events-auto w-full min-w-[280px]"
            modifiers={{
              hasMaintenance: datesWithMaintenance
            }}
            modifiersStyles={{
              hasMaintenance: {
                backgroundColor: 'rgb(59 130 246 / 0.1)',
                color: 'rgb(59 130 246)',
                fontWeight: 'bold'
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceCalendar;
