import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zeanokai - Quản lý Buổi Dạy Gia Sư',
  description: 'Hệ thống quản lý, thống kê và lưu trữ các buổi dạy gia sư đơn giản, đẹp mắt, đa thiết bị.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased selection:bg-blue-500/20 selection:text-blue-600">
        {children}
      </body>
    </html>
  );
}
