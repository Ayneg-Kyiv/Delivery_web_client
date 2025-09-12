'use client';

import React from "react";
import { useSession } from "next-auth/react";
import { ApiClient } from "@/app/api-client";
import Image from "next/image";
import Link from "next/link";
import ContentBox from "@/components/ui/content-box";
import TextInputGroup from "@/components/ui/text-input-group";
import Button from "@/components/ui/button";
import { StarHalf } from "lucide-react";



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

class AddVehiclePage extends React.Component<AddVehicleProps, AddVehicleState> {
    constructor(props: AddVehicleProps) {
        super(props);
        this.state = {
            
            stage: 1,

            driverPhonePresent: false,
            driverLicensePresent: false,

            driverPhone: '',
            driverLicenseImage: null,

            vehicleTypes: ['Легковий автомобіль', 'Мотоцикл', 'Вантажівка', 'Автобус'],
            selectedType: '',
            
            brand: '',
            model: '',
            color: '',
            licensePlate: '',
            
            imageFront: null,
            imageBack: null,
            
            isSubmitting: false,
            
            error: '',
            
            success: false,
        };
    }

    async componentDidMount(): Promise<void> {
        try {
            const response = await ApiClient.get<any>('/account/driver-required-data');

            if (response.success) {
                this.setState({
                    driverPhonePresent: response.data.driverPhone,
                    driverLicensePresent: response.data.driverImage,
                });
            }

            if (!response.data.driverPhone || !response.data.driverImage) {
                this.setState({ stage: 1 });
            } else {
                this.setState({ stage: 2 });
            }
        } catch (error) {
            this.setState({ error: 'Не вдалося завантажити типи транспорту.' });
        }
    }

    handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        this.setState({ ...this.state, [name]: value });
    };

    handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        this.setState({ driverLicenseImage: file, driverLicensePresent: !!file });
    };

    handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        this.setState({ imageFront: file });
    };

    handleFileChangeBack = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        this.setState({ imageBack: file });
    };

    handleSignupStage1 = async (e: React.FormEvent) => {
        e.preventDefault();

        if( !this.state.driverPhonePresent && !this.state.driverLicensePresent ) {
        this.setState( {stage: 2} );
        } else {
            this.setState({ error: 'Будь ласка, заповніть всі поля.' });
        }


    };

    handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        this.setState({ isSubmitting: true, error: '', success: false });

        const { selectedType, brand, model, licensePlate, imageFront, imageBack, color } = this.state;
        if (!selectedType || !brand || !model || !licensePlate || !color || !imageFront || !imageBack) {
            this.setState({ error: 'Будь ласка, заповніть всі поля.', isSubmitting: false });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('type', selectedType);
            
            formData.append('brand', brand);
            formData.append('model', model);
            formData.append('color', color);

            formData.append('licensePlate', licensePlate);
            if (imageFront) {
                formData.append('imageFront', imageFront);
            }
            if (imageBack) {
                formData.append('imageBack', imageBack);
            }

            const response = await ApiClient.post<any>('/profile/add-vehicle', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.success) {
                this.setState({
                    brand: '',
                    model: '',
                    licensePlate: '',
                    selectedType: '',
                    imageFront: null,
                    imageBack: null,
                    success: true,
                    isSubmitting: false,
                });
            } else {
                this.setState({ error: response.message || 'Помилка додавання.', isSubmitting: false });
            }
        } catch (error) {
            this.setState({ error: 'Помилка додавання.', isSubmitting: false });
        }
    };

    renderForStageOne() {
        return (
            <ContentBox>
                
                <form className='flex-1 flex pt-20 p-20 flex-col h-full items-center justify-center' onSubmit={this.handleSignupStage1}>
                       
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            Введіть необхідні дані
                        </h1>

                        <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                            Для доступу, будь ласка, надайте ваш номер телефону та фото водійського посвідчення.
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        
                        {
                            !this.state.driverPhonePresent && (
                                <TextInputGroup
                                    label="E-mail"
                                    value={this.state.driverPhone}
                                    onChange={(e) => this.setState({ driverPhone: e.target.value, driverPhonePresent: !!e.target.value })}
                                    type="email"
                                    className=""
                                    inputClassName={`floating-input`}
                                    labelClassName={`${this.state.driverPhone ? ' filled' : ''} `}
                                    placeholder=""
                                />
                            )
                        }   
                        
                        {
                            !this.state.driverLicensePresent && (
                            <div className="flex flex-col">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="flex-1 flex justify-center items-center p-4"
                                    onChange={this.handleImageChange}
                                />
                            </div>
                            )
                        }

                        {this.state.error && (
                            <div className="text-red-500 font-semibold text-center">{this.state.error}</div>
                        )}

                        <input type="submit" value='Продовжити'
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />

                    </div>

                </form>
                
            </ContentBox>
        );
    }

    renderForStageTwo() {
        return (
            <div>
                <h1>Stage Two</h1>
            </div>
        );  
    }

    render() {
        return (
            {
                1: this.renderForStageOne(),
                2: this.renderForStageTwo(),
            }[this.state.stage] || <div>Невірний етап.</div>
        );
    }
}

export default withSession(AddVehiclePage);