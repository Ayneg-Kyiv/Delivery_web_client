import { ApiClient } from '../api-client';
import { ChangeUserDataDTO, ApiResponse, ApplicationUser } from './profile.d';

export class ProfileService {
  static async changeUserData(userData: ChangeUserDataDTO): Promise<ApiResponse> {
    try {
      // Transform the data to match the API format (lowercase keys)
      const apiData = {
        email: userData.Email,
        firstName: userData.FirstName,
        middleName: userData.MiddleName,
        lastName: userData.LastName,
        dateOfBirth: userData.DateOfBirth,
        aboutMe: userData.AboutMe
      };

  // NOTE: Do NOT prefix with /api here; base URL (NEXT_PUBLIC_API_URL) already includes /api.
  // ApiClient will also de-duplicate if both are present, but we keep paths clean.
  const response = await ApiClient.put<ApiResponse>('/Account/change-user-data', apiData);
      return response;
    } catch (error: any) {
      console.error('Error changing user data:', error);
      
      // Handle different error types
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        Success: false,
        Message: error.message || 'Помилка при збереженні даних',
        Errors: [error.message || 'Невідома помилка']
      };
    }
  }

  static async getUserProfile(): Promise<ApiResponse<ApplicationUser>> {
    try {
  const response = await ApiClient.get<ApiResponse<ApplicationUser>>('/Account');
      return response;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      
      return {
        Success: false,
        Message: error.message || 'Помилка при завантаженні профілю',
        Errors: [error.message || 'Невідома помилка']
      };
    }
  }

  static async updateProfileImage(email: string, imageFile: File): Promise<any> {
    try {
      const form = new FormData();
      // API expects these exact field names based on provided curl
      form.append('Email', email);
      form.append('Image', imageFile);

  const response = await ApiClient.put<any>('/Account/update-profile-image', form, {
        headers: {
          // Override default JSON to let axios set proper multipart boundary
          'Content-Type': 'multipart/form-data',
          'Accept': '*/*',
        },
      });

      return response;
    } catch (error: any) {
      console.error('Error updating profile image:', error);
      throw error;
    }
  }

  static async getProfileImageBlobByEmail(email: string): Promise<Blob> {
    // Try to fetch image directly from API as a blob; many backends expose such endpoint
    // Example: GET /api/Account/profile-image?email=
    const blob = await ApiClient.get<Blob>(
      '/api/Account/profile-image',
      {
        params: { email },
        responseType: 'blob',
        headers: { Accept: 'image/*' }
      }
    );
    return blob;
  }

  static async changePassword(email: string, currentPassword: string, newPassword: string): Promise<ApiResponse<any> | any> {
    try {
      const payload = { email, currentPassword, newPassword };
  const response = await ApiClient.put<any>('/Account/change-password', payload, {
        headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      });
      return response;
    } catch (error: any) {
      console.error('Error changing password:', error);
      // Return API error response if present, else throw
      if (error.response?.data) return error.response.data;
      throw error;
    }
  }
}
