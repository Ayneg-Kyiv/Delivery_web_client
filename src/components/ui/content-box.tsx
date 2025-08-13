import React from 'react';

type ContentBoxProps = {
    children: React.ReactNode;
    height?: string;
    lheight?: string;
};

const ContentBox: React.FC<ContentBoxProps> = ({
    children,
    height = '820px',
    lheight = '760px'
}) => {
    return (
        <div className='flex-1 flex items-center justify-center p-[30px]'>
            <div className={`w-[820px] h-[${height}] bg-[#2c1b48] rounded-[30px] flex flex-col`}>
                <div className={`w-[760px] max-h-[${lheight}] m-[30px] bg-[#0f0e10] rounded-[20px] flex-1 flex flex-col justify-center`}>
                    {children}
                </div>
            </div>
        </div>
  );
};

export default ContentBox;