// Hàm lấy tháng trước tháng hiện tại mặc định
export function getPreviousMonthInfo(): { month: string; year: string } {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed (0 is Jan, 10 is Nov)
  const currentYear = now.getFullYear();

  if (currentMonth === 0) {
    // Tháng 1 -> tháng trước là tháng 12 năm trước
    return {
      month: '12',
      year: (currentYear - 1).toString(),
    };
  }

  return {
    month: currentMonth.toString(), // Vì currentMonth 0-indexed bằng đúng tháng trước dạng 1-indexed (ví dụ tháng 11 là 10, chuyển thành '10')
    year: currentYear.toString(),
  };
}

export function getCurrentMonthInfo(): { month: string; year: string } {
  const now = new Date();
  return {
    month: (now.getMonth() + 1).toString(),
    year: now.getFullYear().toString(),
  };
}

// Chuyển thứ tiếng Việt từ date string YYYY-MM-DD
export function getDayOfWeekVN(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return '';
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return days[date.getDay()];
}

// Format ngày: Thứ Năm, 15/10/2026
export function formatFullDateVN(dateStr: string): string {
  if (!dateStr) return '';
  // dateStr can be '2026-10-15' or ISO string
  const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = cleanDate.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const dayOfWeek = getDayOfWeekVN(cleanDate);
  return `${dayOfWeek}, ${d}/${m}/${y}`;
}

// Format ngày ngắn: 15/10/2026
export function formatShortDateVN(dateStr: string): string {
  if (!dateStr) return '';
  const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = cleanDate.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  return `${d}/${m}/${y}`;
}

// Format tiền tệ VND
export function formatVND(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(num);
}

// Clean number input
export function parseCurrencyInput(val: string): number {
  const cleaned = val.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}
