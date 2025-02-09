import React, { useState } from 'react'

const ToggleBtn = () => {
    const [isChecked, setIsChecked] = useState(false)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked)
    }

    return (
        <>
            <label className='flex cursor-pointer select-none items-center'>
                <div className='relative'>
                    <input
                        type='checkbox'
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className='sr-only'
                    />
                    <div
                        className={`box block h-8 w-14 rounded-full ${isChecked ? 'dark:bg-dark-2 bg-light-2' : 'dark:bg-dark-3 bg-light-3'
                            }`}
                    ></div>
                    <div
                        className={`absolute left-1 top-1 flex size-6 items-center justify-center rounded-full transition 
                            ${isChecked ? 'translate-x-full bg-orange-2' : 'dark:bg-dark-2 bg-light-2'}`}
                    ></div>
                </div>
            </label>
        </>
    )
}

export default ToggleBtn
