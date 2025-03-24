import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/ui/card';
import { Button } from '@/modules/common/components/ui/button';
import { Input } from '@/modules/common/components/ui/input';
import { Label } from '@/modules/common/components/ui/label';
import { Checkbox } from '@/modules/common/components/ui/checkbox';
import { Alert, AlertDescription } from '@/modules/common/components/ui/alert';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import {
  SignupFormValues,
  signupSchema,
} from '../interfaces/signup.validation-schema';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/firebase-errors.helper';

const SignupScreen = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);
  const { signup, googleSignIn } = useAuth();

  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting }: any
  ) => {
    try {
      setAuthError(null);
      await signup(values.email, values.password, { name: values.name });
      navigate('/profile'); // Navigate to profile page on success
    } catch (error: any) {
      console.error('Signup error:', error);
      setAuthError(getErrorMessage(error.code));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setAuthError(null);
      await googleSignIn();
      navigate('/home');
    } catch (error: any) {
      console.error('Google sign-up error:', error);
      setAuthError(getErrorMessage(error.code));
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-md">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create an account
          </CardDescription>
        </CardHeader>

        <CardContent>
          {authError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              terms: false,
            }}
            validationSchema={signupSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <Field name="name">
                      {({ field }: any) => (
                        <div className="flex items-center">
                          <User className="absolute left-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="name"
                            className={`pl-10 ${
                              errors.name && touched.name
                                ? 'border-red-500'
                                : ''
                            }`}
                            placeholder="John Doe"
                            {...field}
                          />
                        </div>
                      )}
                    </Field>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Field name="email">
                      {({ field }: any) => (
                        <div className="flex items-center">
                          <Mail className="absolute left-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            className={`pl-10 ${
                              errors.email && touched.email
                                ? 'border-red-500'
                                : ''
                            }`}
                            placeholder="name@example.com"
                            {...field}
                          />
                        </div>
                      )}
                    </Field>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Field name="password">
                      {({ field }: any) => (
                        <div className="flex items-center">
                          <Lock className="absolute left-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            className={`pl-10 ${
                              errors.password && touched.password
                                ? 'border-red-500'
                                : ''
                            }`}
                            placeholder="••••••••"
                            {...field}
                          />
                        </div>
                      )}
                    </Field>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Field name="confirmPassword">
                      {({ field }: any) => (
                        <div className="flex items-center">
                          <Lock className="absolute left-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type="password"
                            className={`pl-10 ${
                              errors.confirmPassword && touched.confirmPassword
                                ? 'border-red-500'
                                : ''
                            }`}
                            placeholder="••••••••"
                            {...field}
                          />
                        </div>
                      )}
                    </Field>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Field name="terms">
                    {({ field, form }: any) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          form.setFieldValue('terms', checked);
                        }}
                        className={
                          errors.terms && touched.terms ? 'border-red-500' : ''
                        }
                      />
                    )}
                  </Field>
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{' '}
                    <Link
                      to="/terms"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      terms and conditions
                    </Link>
                  </label>
                </div>
                <ErrorMessage
                  name="terms"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Creating account...' : 'Sign Up'}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignUp}
          >
            <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignupScreen;
