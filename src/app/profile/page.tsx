'use client';

import { useEffect, useState } from 'react';
import { ApiClient } from '../api-client';


export default function ProfilePage() {
  const [user, setUser] = useState<ApplicationUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await ApiClient.get<any>('/account');
        console.log('Fetched user:', result);
        setUser(result.data[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Profile not found.</div>;

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