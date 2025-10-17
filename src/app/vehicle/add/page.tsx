'use client';

import React from "react";
import { useSession } from "next-auth/react";
import { apiGet, apiPost } from "@/app/api-client";
import Image from "next/image";
import ContentBox from "@/components/ui/content-box";
import TextInputGroup from "@/components/ui/text-input-group";
import ChangeImageModal from "@/components/ui/change-image";
import Link from "next/link";
import { useI18n } from "@/i18n/I18nProvider";

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
            vehicleTypes: props.t.types,
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
            this.setState({ error: this.props.t.errors.fillAll });
            return;
        }
        this.setState({ stage: 1, error: '' });
    };

    handleStage1 = async (e: React.FormEvent) => {
        e.preventDefault();

        const { imageFront, imageBack } = this.state;
        
        if (!imageFront || !imageBack) {
            this.setState({ error: this.props.t.errors.bothPhotos });
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

            const response = await apiPost<any>('/account/add-vehicle', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            }, this.props.session.data?.accessToken || '');

            // console.log('API Response:', response);

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
                localStorage.setItem("userSubmitted", this.props.session.data?.user?.email || "");
            } else {
                this.setState({ error: response.message || this.props.t.errors.addError, isSubmitting: false });
            }
        } catch (error) {
            this.setState({ error: this.props.t.errors.addError, isSubmitting: false });
        }
    };

    renderStage0() {
        return (
            <ContentBox>
                <form className='flex-1 flex flex-col h-full items-center justify-center' onSubmit={this.handleStage0}>
                    <div className="flex-1 w-full max-w-[500px] flex flex-col items-center mb-[30px]">
                        <Image src='/logo/Logo.png' alt="Logo" width={215} height={60}/>
                        <h1 className="font-title-2 text-[length:var(--title-2-font-size)] tracking-[var(--title-2-letter-spacing)] leading-[var(--title-2-line-height)] mt-2 mb-4 text-center">
                            {this.props.t.title}
                        </h1>
                    </div>
                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        <div className="mb-8">
                            <label className="block text-[#e4e4e4] mb-2">{this.props.t.typeLabel}</label>
                            <select
                                value={this.state.selectedType}
                                onChange={e => this.setState({ selectedType: e.target.value })}
                                className="w-full p-2 py-4 rounded bg-[#222] text-[#e4e4e4] border border-gray-700"
                            >
                                <option value="">{this.props.t.chooseTypePlaceholder}</option>
                                {this.state.vehicleTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <TextInputGroup
                            label={this.props.t.brandLabel}
                            value={this.state.brand}
                            onChange={e => this.setState({ brand: e.target.value })}
                            type="text"
                            inputClassName="floating-input"
                            labelClassName={this.state.brand ? 'filled' : ''}
                            placeholder=""
                        />
                        <TextInputGroup
                            label={this.props.t.modelLabel}
                            value={this.state.model}
                            onChange={e => this.setState({ model: e.target.value })}
                            type="text"
                            inputClassName="floating-input"
                            labelClassName={this.state.model ? 'filled' : ''}
                            placeholder=""
                        />
                        <TextInputGroup
                            label={this.props.t.colorLabel}
                            value={this.state.color}
                            onChange={e => this.setState({ color: e.target.value })}
                            type="text"
                            inputClassName="floating-input"
                            labelClassName={this.state.color ? 'filled' : ''}
                            placeholder=""
                        />
                        <TextInputGroup
                            label={this.props.t.licensePlateLabel}
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
                            value={this.props.t.buttons.continue}
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />
                        <Link href="/vehicle" className="text-[#2892f6] underline text-center mt-4">{this.props.t.backToVehicles}</Link>
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
                            {this.props.t.stage1.title}
                        </h1>
                    </div>
                    <div className="flex-1 w-full max-w-[500px] space-y-5 flex flex-col">
                        <div className="flex flex-col">
                            <button
                                type="button"
                                className="button-type-1 mb-4 px-4 h-[60px] bg-blue-600 text-white rounded"
                                onClick={() => this.setState({ showFrontModal: true })}
                            >
                                {this.props.t.stage1.uploadFrontButton}
                            </button>
                            <ChangeImageModal
                                open={!!this.state.showFrontModal}
                                title={this.props.t.stage1.frontModalTitle}
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
                                {this.props.t.stage1.uploadBackButton}
                            </button>
                            <ChangeImageModal
                                open={!!this.state.showBackModal}
                                title={this.props.t.stage1.backModalTitle}
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
                            value={this.state.isSubmitting ? this.props.t.buttons.adding : this.props.t.buttons.add}
                            disabled={this.state.isSubmitting}
                            className="w-full h-[60px] button-type-2 font-body-1 text-[#fffefe] text-[length:var(--body-1-font-size)] tracking-[var(--body-1-letter-spacing)] leading-[var(--body-1-line-height)]"
                        />
                        <Link href="/vehicle" className="text-[#2892f6] underline text-center mt-4">{this.props.t.backToVehicles}</Link>
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
                            {this.props.t.stage2.successTitle}
                        </h1>
                        <Link href="/vehicle" className="text-[#2892f6] underline text-center mt-4">{this.props.t.backToVehicles}</Link>
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
            default: return <div>{this.props.t.errors.invalidStage}</div>;
        }
    }
}

const AddVehicleWithSession = withSession(AddVehicleForm);
const AddVehicleWrapper = (props: any) => {
    const { messages } = useI18n();
    const t = messages.addVehicle;
    return <AddVehicleWithSession {...props} t={t} />;
};

export default AddVehicleWrapper;