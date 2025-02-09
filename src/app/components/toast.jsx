import React, { useState, useEffect } from "react";
import { IoCloseCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';


export default function ToastBar({ log }) {

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setProgress((prev) => Math.min(prev + 1, 100)),
      30
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`
      flex flex-col w-80 min-h-14 h-fit justify-between rounded-lg z-10 absolute top-10 right-6 md:right-10 bg-dark-1 dark:bg-light-1`
    }>

      <div className="flex gap-2 px-2 h-14 items-center">

        {log?.error ?
          <IoCloseCircleOutline className="text-red-500 size-8" />
          :
          <IoCheckmarkCircleOutline className="text-green-500 size-8" />
        }

        <p className="dark:text-dark-1 text-light-1">{log?.message}</p>
      </div>

      <div
        style={{
          width: `${progress}%`,
          backgroundColor: `${log?.error ? '#ef4444' : '#22c55e'}`,
          height: '4px',
          borderRadius: '4px',
          transition: 'width 0.03s linear',
        }} />

    </div>
  );
}
