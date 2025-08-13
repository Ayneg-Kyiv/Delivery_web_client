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

// Types for user data change functionality
export interface ChangeUserDataDTO {
  Email: string;
  FirstName?: string;
  MiddleName?: string;
  LastName?: string;
  DateOfBirth?: string; // ISO date string
  AboutMe?: string;
}

export interface ApiResponse<T = any> {
  Success: boolean;
  Message?: string;
  Data?: T;
  Errors?: string[];
}