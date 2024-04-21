'use client';

import { Button } from '@nextui-org/react';
import { useState } from 'react';

const ButtonCounter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p className='font-mono text-2xl'>You clicked {count} times</p>
      <Button onClick={() => setCount(count + 1)}>Click me</Button>
    </div>
  );
};

export default ButtonCounter;
