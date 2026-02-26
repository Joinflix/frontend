import type { Day } from "../types/days";

export const getNextSevenDays = (): Day[] => {
  const days: Day[] = [];
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    days.push({
      fullDate: date.toISOString().split("T")[0],
      dayNum: date.getDate(),
      dayName: i === 0 ? "오늘" : weekDays[date.getDay()],
    });
  }
  return days;
};
