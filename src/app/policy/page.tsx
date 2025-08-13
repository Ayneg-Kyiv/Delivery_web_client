"use client";

import React from "react";

interface PolicyPageState {
    accepted: boolean;
}

class PolicyPage extends React.Component<null, PolicyPageState> {
    constructor(props: null) {
        super(props);
        this.state = {
            accepted: false,
        };
    }

    handleAccept = () => {
        this.setState({ accepted: true });
    };

    renderContent = () => (
        <div className="h-[89vh] w-full flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg">
            <div className="m-8">
                <h1 className="text-4xl font-bold">Privacy Policy</h1>
            </div>
            <div className="flex flex-col w-95 items-stretch justify-center">
                <div className="mb-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                    <p>
                        This is our privacy policy. Please read it carefully before accepting.
                    </p>
                </div>
                {!this.state.accepted ? (
                    <button
                        onClick={this.handleAccept}
                        className="mt-6 px-4 py-2 bg-blue-500 text-white text-2xl rounded-lg hover:bg-gray-600 transition-colors duration-300 active:opacity-75"
                    >
                        Accept Policy
                    </button>
                ) : (
                    <div className="mt-6 text-green-600 text-xl font-semibold">
                        Policy Accepted!
                    </div>
                )}
            </div>
        </div>
    );

    render() {
        return <>{this.renderContent()}</>;
    }
}

export default PolicyPage;