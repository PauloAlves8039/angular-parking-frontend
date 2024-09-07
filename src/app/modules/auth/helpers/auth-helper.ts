export class AuthHelper {
  constructor() {}

  clearAuthFields(component: { email: string, password: string, confirmPassword?: string }) {
    component.email = '';
    component.password = '';

    if (component.confirmPassword !== undefined) {
      component.confirmPassword = '';
    }
  }

  validateAuthFields(component: { email: string, password: string, confirmPassword?: string }): boolean {
    const emailAndPasswordValid = !!component.email && !!component.password;

    if (component.confirmPassword !== undefined) {
      return emailAndPasswordValid && !! component.confirmPassword;
    }

    return emailAndPasswordValid;
  }

}
