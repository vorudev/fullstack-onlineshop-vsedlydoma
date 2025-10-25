// app/admin/stats/MonthSelector.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface MonthSelectorProps {
  currentYear: number;
  currentMonth: number;
}

export default function MonthSelector({ currentYear, currentMonth }: MonthSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const months = [
    { value: 1, label: 'Январь' },
    { value: 2, label: 'Февраль' },
    { value: 3, label: 'Март' },
    { value: 4, label: 'Апрель' },
    { value: 5, label: 'Май' },
    { value: 6, label: 'Июнь' },
    { value: 7, label: 'Июль' },
    { value: 8, label: 'Август' },
    { value: 9, label: 'Сентябрь' },
    { value: 10, label: 'Октябрь' },
    { value: 11, label: 'Ноябрь' },
    { value: 12, label: 'Декабрь' },
  ];

  // Генерируем список годов (текущий год ± 5 лет)
  const currentDate = new Date();
  const currentYearNow = currentDate.getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYearNow - 5 + i);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    updateUrl(year, selectedMonth);
  };

  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    updateUrl(selectedYear, month);
  };

  const updateUrl = (year: number, month: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', year.toString());
    params.set('month', month.toString());
    router.push(`?${params.toString()}`);
  };

  const goToPreviousMonth = () => {
    const newMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const newYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    updateUrl(newYear, newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
    const newYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    updateUrl(newYear, newMonth);
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    setSelectedYear(year);
    setSelectedMonth(month);
    updateUrl(year, month);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg shadow">
      <div className="flex items-center gap-2">
        <button
          onClick={goToPreviousMonth}
          className="px-3 py-2 text-sm font-medium text-white  rounded-md bg-neutral-800  transition-colors"
          aria-label="Предыдущий месяц"
        >
          ←
        </button>

        <select
          value={selectedMonth}
          onChange={(e) => handleMonthChange(Number(e.target.value))}
          className="px-4 py-2 text-sm font-medium border  rounded-md focus:outline-none "
        >
          {months.map((month) => (
            <option key={month.value} value={month.value} className="bg-neutral-800 hover:bg-neutral-700 " >
              {month.label}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="px-4 py-2 text-sm font-medium border  rounded-md focus:outline-none  "
        >
          {years.map((year) => (
            <option key={year} value={year} className="bg-neutral-800 hover:bg-neutral-700 ">
              {year}
            </option>
          ))}
        </select>

        <button
          onClick={goToNextMonth}
          className="px-3 py-2 text-sm font-medium rounded-md text-white bg-neutral-800  transition-colors"
          aria-label="Следующий месяц"
        >
          →
        </button>
      </div>

      <button
        onClick={goToCurrentMonth}
        className="px-4 py-2 text-sm font-medium text-white bg-neutral-800 rounded-md  transition-colors"
      >
        Текущий месяц
      </button>
    </div>
  );
}