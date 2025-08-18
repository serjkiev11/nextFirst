'use client';

import { Button, Card, CardBody } from '@heroui/react';

export default function Home() {
  return (
    <main className='container mx-auto p-4'>
      <h1 className='text-4xl font-bold mb-8'>Hello world super</h1>

      <div className='space-y-4'>
        <Button color='primary' variant='solid'>
          Primary Button
        </Button>

        <Card className='max-w-[400px]'>
          <CardBody>
            <p>This is a HeroUI Card component</p>
          </CardBody>
        </Card>

        <div className='bg-blue-500 text-white p-4 rounded'>
          This should have blue background (Tailwind test)
        </div>
      </div>
    </main>
  );
}
