import React from 'react';

type ContentBoxProps = {
    children: React.ReactNode;
    height?: string;
    lheight?: string;
};

const ContentBox: React.FC<ContentBoxProps> = ({
    children,
    height = null,
    lheight = null
}) => {
    return (
        <div className='flex-1 flex flex-col items-center justify-center p-[30px]'>
            <div className={`flex-1 w-[820px] bg-[#2c1b48] rounded-[30px] flex flex-col`}>
                <div className={`flex-1 w-[760px] m-[30px] bg-[#0f0e10] rounded-[20px] flex flex-col justify-center`}>
                    {children}
                </div>
            </div>
        </div>
  );
};

export default ContentBox;