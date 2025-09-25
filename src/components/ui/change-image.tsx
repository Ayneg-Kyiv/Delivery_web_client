import React, { useRef } from 'react';
import Image from 'next/image';

type ChangeImageProps = {
    open: boolean;
    onClose: () => void;
    imageUrl?: string; // Current image URL or preview
    imageFile?: File | null; // Current image file
    setImageFile: (file: File | null) => void; // Setter for image file
    setImageUrl: (url: string) => void; // Setter for image URL (preview)
    title?: string; // Optional modal title
    exampleImageUrl?: string; // Optional example image
};

const ChangeImageModal: React.FC<ChangeImageProps> = ({
    open,
    onClose,
    imageUrl,
    imageFile,
    setImageFile,
    setImageUrl,
    title = "Photo Upload",
    exampleImageUrl,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!open) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);

        const reader = new FileReader();
        reader.onload = (ev) => {
            const result = ev.target?.result;
            if (typeof result === "string") {
                setImageUrl(result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        setImageFile(file);

        const reader = new FileReader();
        
        reader.onerror = () => {
            console.error('Error reading file');
        };

        reader.onload = (ev) => {
            const result = ev.target?.result;
            if (typeof result === "string") {
                setImageUrl(result);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={`fixed overflow-y-auto inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 `}>
            <div className={`relative bg-[#18171b] rounded-[20px] w-full max-w-[820px] mx-4 p-8 ${imageUrl ? 'mt-220 mb-10' : ''}`}>
                <button
                    className={`absolute top-12 left-6 text-white text-2xl `}
                    onClick={onClose}
                    aria-label="Close"
                >
                    ←
                </button>
                <div className="text-center mt-4">
                    <h2 className="text-3xl font-semibold text-white mb-6">{title}</h2>
                    <div className="border-b border-gray-700 mb-8"></div>
                    {exampleImageUrl && (
                        <>
                            <div className="text-xl text-white mb-4">Приклад хорошого зображення</div>
                            <Image
                                height={300}
                                width={500}
                                src={exampleImageUrl}
                                alt="Example"
                                className="mx-auto rounded-[20px] w-full max-w-[500px] max-h-[600px] object-cover object-[25%_25%] mb-8"
                            />
                        </>
                    )}
                    <div
                        className="border-2 border-dashed border-[#7c5dfa] rounded-[20px] p-8 mb-6 cursor-pointer"
                        onDrop={handleDrop}
                        onDragOver={e => e.preventDefault()}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="text-2xl text-white mb-2">Перетяніть зображення сюди, або натисніть щоб обрати</div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </div>
                    {/* Live Preview */}
                    <div className="mb-4">
                        <div className="text-xl text-white mb-2">Прев'ю:</div>
                        {imageUrl ? (
                            <Image
                                height={300}
                                width={500}
                                src={imageUrl}
                                alt="Preview"
                                className="mx-auto rounded-[20px] w-full max-w-[500px] max-h-[600px] object-cover mb-2"
                            />
                        ) : (
                            <div className="text-gray-400">Зображення не вибрано</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangeImageModal; 