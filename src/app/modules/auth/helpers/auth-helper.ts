export class AuthHelper {
  constructor() {}

  clearAuthFields(component: { email: string, password: string, confirmPassword?: string }) {
    component.email = '';
    component.password = '';

    if (component.confirmPassword !== undefined) {
      component.confirmPassword = '';
    }
  }

}
