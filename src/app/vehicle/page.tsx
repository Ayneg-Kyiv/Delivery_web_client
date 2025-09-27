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

class AddVehiclePage extends React.Component<VehicleProps, VehicleState> {
    constructor(props: AddVehicleProps) {
        super(props);
        this.state = {
            
            stage: 0,

            agreedToTerms: false,

            driverPhonePresent: false,
            driverPhone: '',
            
            driverProfileImagePresent: false,
            showProfileModal: false,
            driverProfileImageUrl: null,
            driverProfileImage: null,

            driverLicensePresent: false,
            showLicenseModal: false,
            driverLicenseImageUrl: null,
            driverLicenseImage: null,

            vehicles: [],
            
            error: '',
            
            success: false,
        };
    }

    async componentDidMount(): Promise<void> {
        try {
            console.log(this.props.session);

            const response = await ApiClient.get<any>('/account/driver-required-data');

            if (response.success) {
                this.setState({
                    driverPhonePresent: (response.data.driverPhone !== null ? true : false),
                    driverPhone: response.data.driverPhone,
                    driverLicensePresent: response.data.driverImage,
                    driverProfileImagePresent: response.data.driverProfileImage,
                });
            }

            if (!this.props.session.data.user.roles.includes('Driver')) {
                this.setState({ stage: 0 });
            } else {
                this.setState({ stage: 2 });
            }

            const vehiclesResponse = await ApiClient.get<any>('/account/user-vehicles');
            console.log(vehiclesResponse);

            if (vehiclesResponse.success) {
                this.setState({ vehicles: vehiclesResponse.data });
            }
        } catch (error) {
            this.setState({ error: 'Помилка завантаження даних.' });
        }
    }

    handleSignupStage0 = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!this.state.driverPhonePresent && this.state.driverPhone) {
            this.setState( { driverPhonePresent: true } );
        }

        if(this.state.agreedToTerms && this.state.driverPhone) {
            if(!this.state.driverProfileImagePresent || !this.state.driverLicensePresent) {
                this.setState({ stage: 1 });
            } else {
                this.setState({ stage: 2 });
            }   
        } else {
            this.setState({ error: 'Будь ласка, заповніть всі поля.' });
        }
    }

    handleSignupStage1 = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!this.state.driverPhonePresent && this.state.driverPhone)
            await this.setState({ driverPhonePresent: true });
        if (!this.state.driverLicensePresent && this.state.driverLicenseImage) 
            await this.setState({ driverLicensePresent: true });
        if (!this.state.driverProfileImagePresent && this.state.driverProfileImage) 
            await this.setState({ driverProfileImagePresent: true });

        if( this.state.driverPhonePresent && this.state.driverLicensePresent && this.state.driverProfileImagePresent) {

            const dataDto = new FormData();

            if(this.state.driverPhone)
                dataDto.append('phoneNumber', this.state.driverPhone);
            if (this.state.driverLicenseImage)
                dataDto.append('image', this.state.driverLicenseImage);
            if (this.state.driverProfileImage)
                dataDto.append('profileImage', this.state.driverProfileImage);

            const response = await ApiClient.post<any>('/account/set-driver-required-data', dataDto,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
             );

            console.log(response);
            
            if (response.success) {
                this.setState( {stage: 2} ); 
            } else {
            this.setState({ error: 'Будь ласка, заповніть всі поля.' });
            }
        } else {
            this.setState({ error: 'Будь ласка, заповніть всі поля.' });
        }
    };

    handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
    };

    renderForStageZero() {
        return (
            <ContentBox>
                
                <form className='flex-1 flex  flex-col h-full items-center justify-center' onSubmit={this.handleSignupStage0}>
                       
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            Введіть необхідні дані
                        </h1>

                        <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                            Для доступу, будь ласка, надайте або підтвердіть { !this.state.driverPhonePresent ? 'ваш номер телефону.' : ''}
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                                <TextInputGroup
                                    label="Номер телефону"
                                    value={this.state.driverPhone || ''}
                                    onChange={(e) => this.setState({ driverPhone: e.target.value })}
                                    type="tel"
                                    className=""
                                    inputClassName={`floating-input`}
                                    labelClassName={`${this.state.driverPhone ? ' filled' : ''} `}
                                    placeholder=""
                                />

                            <div className="flex flex-row items-center space-x-2 py-4">
                                <div className="flex items-center">
                                    <div
                                        className={` custom-checkbox-outer${this.state.agreedToTerms ? " custom-checkbox-checked" : ""}`}
                                        onClick={() => this.setState({ agreedToTerms: !this.state.agreedToTerms })}
                                        tabIndex={0}
                                        role="checkbox"
                                        aria-checked={this.state.agreedToTerms}
                                        id="agreeTerms"
                                        style={{ outline: "none" }}
                                        >
                                        <div className="custom-checkbox-inner" />
                                    </div>
                                </div>
                                <label
                                    htmlFor="agreeTerms"
                                    className="pl-2 font-body-2 text-[#e4e4e4] text-[length:var(--body-2-font-size)] tracking-[var(--body-2-letter-spacing)] leading-[var(--body-2-line-height)] cursor-pointer"
                                >
                                    Я погоджуюсь з <Link href="/terms" className="text-[#2892f6] underline">Умовами використання</Link>, <Link href="/policy" className="text-[#2892f6] underline">Політикою конфіденційності</Link> та використанням cookie у проекті
                                </label>
                            </div>

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


    renderForStageOne() {
        return (
            <ContentBox>
                
                <form className='flex-1 flex flex-col h-full items-center justify-center' onSubmit={this.handleSignupStage1}>
                       
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            Введіть необхідні дані
                        </h1>

                        <p className='font-subtitle-3 font-[number:var(--subtitle-3-font-weight)] text-[#e4e4e4] text-[length:var(--subtitle-3-font-size)] text-center tracking-[var(--subtitle-3-letter-spacing)] leading-[var(--subtitle-3-line-height)] [font-style:var(--subtitle-3-font-style)]'>
                            Для доступу, будь ласка, надайте { !this.state.driverProfileImagePresent ? 'ваше фото для профілю' : ''} 
                                                             { !this.state.driverProfileImagePresent && !this.state.driverLicensePresent ? 'та' : ''}
                                                             { !this.state.driverLicensePresent ? 'фото водійського посвідчення' : ''}.
                        </p>
                    </div>

                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col"> 

                        {
                            !this.state.driverProfileImagePresent && (
                            <div className="flex flex-col">
                                    <button
                                        type="button"
                                        className="button-type-1 mb-4 px-4 h-[60px] bg-blue-600 text-white rounded"
                                        onClick={() => this.setState({ showProfileModal: true })}
                                    >
                                        Завантажити фото профілю
                                    </button>
                                    <ChangeImageModal
                                        open={!!this.state.showProfileModal}
                                        title="Завантажте фото профілю"
                                        exampleImageUrl="/person_example.png"
                                        imageUrl={
                                            this.state.driverProfileImage
                                                ? URL.createObjectURL(this.state.driverProfileImage)
                                                : ''
                                        }
                                        imageFile={this.state.driverProfileImage}
                                        setImageFile={(file) =>
                                            this.setState({
                                                driverProfileImage: file
                                            })
                                        }
                                        setImageUrl={() => {}}
                                        onClose={() => this.setState({ showProfileModal: false })}
                                    />
                                </div>
                            )
                        }
                        
                        {
                            !this.state.driverLicensePresent && (
                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        className="button-type-1 mb-4 px-4 h-[60px] bg-blue-600 text-white rounded"
                                        onClick={() => this.setState({ showLicenseModal: true })}
                                    >
                                        Завантажити фото водійського посвідчення
                                    </button>
                                    <ChangeImageModal
                                        open={!!this.state.showLicenseModal}
                                        title="Завантажте фото водійського посвідчення"
                                        exampleImageUrl="/dr_example.png"
                                        imageUrl={
                                            this.state.driverLicenseImage
                                                ? URL.createObjectURL(this.state.driverLicenseImage)
                                                : ''
                                        }
                                        imageFile={this.state.driverLicenseImage}
                                        setImageFile={(file) =>
                                            this.setState({
                                                driverLicenseImage: file
                                            })
                                        }
                                        setImageUrl={() => {}}
                                        onClose={() => this.setState({ showLicenseModal: false })}
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
        <ContentBox>        
                <form className='flex-1 flex  flex-col h-full items-center justify-center' onSubmit={this.handleSignupStage0}>
                       
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            Транспортні засоби
                        </h1>
                        
                        {
                            !this.props.session.data.user.roles.includes('Driver') && (
                                <div>
                                    <p>Щоб стати водієм, додайте щонайменше один транспортний засіб та очікуйте підтвердження адміністрацією.</p>
                                </div>
                            )
                        }
                    </div>

                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col justify-end">
                        

                        <div className=" flex-1 flex flex-col space-y-4 mb-4">
                            {
                                this.state.vehicles.length > 0 ? (
                                    this.state.vehicles.map((vehicle) => (
                                        <div key={vehicle.id} className="border border-gray-700 rounded-lg p-4">
                                            <h2 className="text-xl font-semibold text-white mb-2">{vehicle.brand} {vehicle.model}</h2>
                                            <p className="text-gray-400 mb-1">Тип: {vehicle.type}</p>
                                            <p className="text-gray-400 mb-1">Колір: {vehicle.color}</p>
                                            <p className="text-gray-400 mb-1">Номерний знак: {vehicle.numberPlate}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-400 text-center">Немає доданих транспортних засобів</div>
                                )
                                
                            }
                        </div>

                        <Link href='/vehicle/add' className=" flex justify-center items-center w-full h-[60px] rounded-lg button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]">Додати транспортний засіб</Link>
                
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

    render() {
        return (
            {
                0: this.renderForStageZero(),
                1: this.renderForStageOne(),
                2: this.renderForStageTwo(),
            }[this.state.stage] || <div>Невірний етап.</div>
        );
    }
}

export default withSession(AddVehiclePage);