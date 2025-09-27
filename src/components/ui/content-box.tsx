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
            <div className={`flex-1 md:w-[700px] lg:w-[820px] max-w-[820px] bg-[#2c1b48] p-[8px] md:p-[30px] md:rounded-[30px] flex flex-col`}>
                <div className={`flex-1 w-full max-w-[760px] bg-[#0f0e10] rounded-[20px] px-8 py-20 flex flex-col justify-center`}>
                    {children}
                </div>
            </div>
        </div>
  );
};

export default ContentBox;