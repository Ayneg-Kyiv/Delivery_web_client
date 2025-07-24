
'use client';

import React from 'react';
import { ApiClient } from '../api-client';

interface ProfilePageState {
  user: ApplicationUser | null;
  loading: boolean;
}

export default class ProfilePage extends React.Component<{}, ProfilePageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      user: null,
      loading: true,
    };
  }

  async componentDidMount() {
    try {
      await ApiClient.get<any>('/csrf');

      const result = await ApiClient.get<any>('/account');
      console.log('Fetched user:', result);
      this.setState({ user: result.data[0] });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { user, loading } = this.state;
    if (loading) return <div className='flex-1'>Loading...</div>;
    if (!user) return <div className='flex-1'>Profile not found.</div>;

    return (
      <div className="flex-1 w-full max-w-xl mx-auto p-6 bg-white rounded shadow text-gray-800">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {user.imagePath && (
          <img
            src={user.imagePath}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
        )}
        <div className="mb-2"><strong>Name:</strong> {user.firstName} {user.middleName} {user.lastName}</div>
        <div className="mb-2"><strong>Email:</strong> {user.email}</div>
        <div className="mb-2"><strong>Date of Birth:</strong> {user.dateOfBirth || '—'}</div>
        <div className="mb-2"><strong>About Me:</strong> {user.aboutMe || '—'}</div>
        <div className="mb-2"><strong>Address:</strong> {user.address || '—'}</div>
        <div className="mb-2"><strong>Rating:</strong> {user.rating ?? 0} / 5</div>
      </div>
    );
  }
}