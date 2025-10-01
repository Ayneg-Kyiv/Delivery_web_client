'use client';

import React from "react";
import { useSession } from "next-auth/react";
import { ApiClient } from "@/app/api-client";
import Image from "next/image";
import ContentBox from "@/components/ui/content-box";
import TextInputGroup from "@/components/ui/text-input-group";
import ChangeImageModal from "@/components/ui/change-image";
import Link from "next/link";

// HOC to inject session into class components
const withSession = (Component: React.ComponentType<any>) => {
    const WrappedWithSession = (props: any) => {
        const session = useSession();

        if (session.status === 'loading') {
            return <div>Loading...</div>;
        }

        if (session.status === 'unauthenticated') {
            location.href = '/signin';
        }

        // Only allow class components
        if (Component.prototype && Component.prototype.render) {
            return <Component session={session} {...props} />;
        }

        throw new Error(
            [
                "You passed a function component, `withSession` is not needed.",
                "You can `useSession` directly in your component.",
            ].join("\n")
        );
    };
    WrappedWithSession.displayName = `withSession(${Component.displayName || Component.name || 'Component'})`;
    return WrappedWithSession;
};
class AddVehicleForm extends React.Component<AddVehicleProps, AddVehicleState> {
    constructor(props: AddVehicleProps) {
        super(props);
        this.state = {
            stage: 0,
            vehicleTypes: ['Легковий автомобіль', 'Мотоцикл', 'Вантажівка', 'Автобус'],
            selectedType: '',
            brand: '',
            model: '',
            color: '',
            licensePlate: '',
            imageFront: null,
            imageBack: null,
            showFrontModal: false,
            showBackModal: false,
            isSubmitting: false,
            error: '',
            success: false,
        };
    }

    handleStage0 = (e: React.FormEvent) => {
        e.preventDefault();
        const { selectedType, brand, model, licensePlate, color } = this.state;
        if (!selectedType || !brand || !model || !licensePlate || !color) {
            this.setState({ error: 'Будь ласка, заповніть всі поля.' });
            return;
        }
        this.setState({ stage: 1, error: '' });
    };

    handleStage1 = async (e: React.FormEvent) => {
        e.preventDefault();

        const { imageFront, imageBack } = this.state;
        
        if (!imageFront || !imageBack) {
            this.setState({ error: 'Будь ласка, завантажте обидва фото.' });
            return;
        }
        
        this.setState({ isSubmitting: true, error: '', success: false });

        try {
            const formData = new FormData();
            formData.append('type', this.state.selectedType);
            formData.append('brand', this.state.brand);
            formData.append('model', this.state.model);
            formData.append('color', this.state.color);
            formData.append('numberPlate', this.state.licensePlate);
            if (imageFront) formData.append('imageFront', imageFront);
            if (imageBack) formData.append('imageBack', imageBack);

            const response = await ApiClient.post<any>('/account/add-vehicle', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log('API Response:', response);

            if (response.success) {
                this.setState({
                    brand: '',
                    model: '',
                    licensePlate: '',
                    color: '',
                    selectedType: '',
                    imageFront: null,
                    imageBack: null,
                    success: true,
                    isSubmitting: false,
                    stage: 2,
                });
                localStorage.setItem("isApplicationSubmitted", "true");
            } else {
                this.setState({ error: response.message || 'Помилка додавання.', isSubmitting: false });
            }
        } catch (error) {
            this.setState({ error: 'Помилка додавання.', isSubmitting: false });
        }
    };

    renderStage0() {
        return (
            <ContentBox>
                <form className='flex-1 flex flex-col h-full items-center justify-center' onSubmit={this.handleStage0}>
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            Додати транспортний засіб
                        </h1>
                    </div>
                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        <div className="mb-8">
                            <label className="block text-[#e4e4e4] mb-2">Тип транспортного засобу</label>
                            <select
                                value={this.state.selectedType}
                                onChange={e => this.setState({ selectedType: e.target.value })}
                                className="w-full p-2 py-4 rounded bg-[#222] text-[#e4e4e4] border border-gray-700"
                            >
                                <option value="">Оберіть тип</option>
                                {this.state.vehicleTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <TextInputGroup
                            label="Марка"
                            value={this.state.brand}
                            onChange={e => this.setState({ brand: e.target.value })}
                            type="text"
                            inputClassName="floating-input"
                            labelClassName={this.state.brand ? 'filled' : ''}
                            placeholder=""
                        />
                        <TextInputGroup
                            label="Модель"
                            value={this.state.model}
                            onChange={e => this.setState({ model: e.target.value })}
                            type="text"
                            inputClassName="floating-input"
                            labelClassName={this.state.model ? 'filled' : ''}
                            placeholder=""
                        />
                        <TextInputGroup
                            label="Колір"
                            value={this.state.color}
                            onChange={e => this.setState({ color: e.target.value })}
                            type="text"
                            inputClassName="floating-input"
                            labelClassName={this.state.color ? 'filled' : ''}
                            placeholder=""
                        />
                        <TextInputGroup
                            label="Номерний знак"
                            value={this.state.licensePlate}
                            onChange={e => this.setState({ licensePlate: e.target.value })}
                            type="text"
                            inputClassName="floating-input"
                            labelClassName={this.state.licensePlate ? 'filled' : ''}
                            placeholder=""
                        />
                        {this.state.error && (
                            <div className="text-red-500 font-semibold text-center">{this.state.error}</div>
                        )}
                        <input
                            type="submit"
                            value="Продовжити"
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />
                        <Link href="/vehicle" className="text-[#2892f6] underline text-center mt-4">Назад до транспортних засобів</Link>
                    </div>
                </form>
            </ContentBox>
        );
    }

    renderStage1() {
        return (
            <ContentBox>
                <form className='flex-1 flex flex-col h-full items-center justify-center' onSubmit={this.handleStage1}>
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            Завантажте фото транспортного засобу
                        </h1>
                    </div>
                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        <div className="flex flex-col">
                            <button
                                type="button"
                                className="button-type-1 mb-4 px-4 h-[60px] bg-blue-600 text-white rounded"
                                onClick={() => this.setState({ showFrontModal: true })}
                            >
                                Завантажити фото (перед)
                            </button>
                            <ChangeImageModal
                                open={!!this.state.showFrontModal}
                                title="Завантажте фото транспортного засобу (перед)"
                                exampleImageUrl="/car_front.png"
                                imageUrl={
                                    this.state.imageFront
                                        ? URL.createObjectURL(this.state.imageFront)
                                        : ''
                                }
                                imageFile={this.state.imageFront}
                                setImageFile={file => this.setState({ imageFront: file })}
                                setImageUrl={() => {}}
                                onClose={() => this.setState({ showFrontModal: false })}
                            />
                        </div>
                        <div className="flex flex-col">
                            <button
                                type="button"
                                className="button-type-1 mb-4 px-4 h-[60px] bg-blue-600 text-white rounded"
                                onClick={() => this.setState({ showBackModal: true })}
                            >
                                Завантажити фото (зад)
                            </button>
                            <ChangeImageModal
                                open={!!this.state.showBackModal}
                                title="Завантажте фото транспортного засобу (зад)"
                                exampleImageUrl="/car_back.png"
                                imageUrl={
                                    this.state.imageBack
                                        ? URL.createObjectURL(this.state.imageBack)
                                        : ''
                                }
                                imageFile={this.state.imageBack}
                                setImageFile={file => this.setState({ imageBack: file })}
                                setImageUrl={() => {}}
                                onClose={() => this.setState({ showBackModal: false })}
                            />
                        </div>
                        {this.state.error && (
                            <div className="text-red-500 font-semibold text-center">{this.state.error}</div>
                        )}
                        <input
                            type="submit"
                            value={this.state.isSubmitting ? 'Додається...' : 'Додати'}
                            disabled={this.state.isSubmitting}
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />
                        <Link href="/vehicle" className="text-[#2892f6] underline text-center mt-4">Назад до транспортних засобів</Link>
                    </div>
                </form>
            </ContentBox>
        );
    }

    renderStage2() {
        return (
            <ContentBox>
                <div className="flex-1 flex flex-col h-full items-center justify-center">
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            Транспортний засіб додано успішно!
                        </h1>
                        <Link href="/vehicle" className="text-[#2892f6] underline text-center mt-4">Назад до транспортних засобів</Link>
                    </div>
                </div>
            </ContentBox>
        );
    }

    render() {
        switch (this.state.stage) {
            case 0: return this.renderStage0();
            case 1: return this.renderStage1();
            case 2: return this.renderStage2();
            default: return <div>Невірний етап.</div>;
        }
    }
}

export default withSession(AddVehicleForm);