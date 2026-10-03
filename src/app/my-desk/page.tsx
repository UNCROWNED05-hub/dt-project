import React from 'react';
import { MyDeskView } from '@/components/desk/MyDeskView';

export const metadata = {
  title: 'My Desk | Vellum',
  description: 'Personal study desk, active streaks, and chapter verification stamps.',
};

export default function MyDeskPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <MyDeskView />
    </div>
  );
}
