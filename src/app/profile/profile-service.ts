import { ApiClient } from '../api-client';
import { ChangeUserDataDTO, ApiResponse } from './profile.d';

// Import the global type
declare global {
  type ApplicationUser = {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    email: string;
    dateOfBirth?: string;
    aboutMe?: string;
    address?: string;
    imagePath?: string;
    rating: number;
  };
}

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

      const response = await ApiClient.put<ApiResponse>('/api/Account/change-user-data', apiData);
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
      const response = await ApiClient.get<ApiResponse<ApplicationUser>>('/api/Account');
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
}
