type ApplicationUser = {
  id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email: string;
  dateOfBirth?: string;
  aboutMe?: string;
  phoneNumber?: string;
  address?: string;
  imagePath?: string;
  rating: number;
};

// Types for user data change functionality
export interface ChangeUserDataDTO {
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dateOfBirth?: string; // ISO date string
  aboutMe?: string;
}

export interface ApiResponse<T = any> {
  Success: boolean;
  Message?: string;
  Data?: T;
  Errors?: string[];
}