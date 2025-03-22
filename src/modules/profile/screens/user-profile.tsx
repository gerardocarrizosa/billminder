import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/modules/common/components/ui/avatar';
import { Button } from '@/modules/common/components/ui/button';
import { Input } from '@/modules/common/components/ui/input';
import { Label } from '@/modules/common/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/modules/common/components/ui/select';
import { toast } from 'react-hot-toast';
import { PenLine, Camera, User, Check, X } from 'lucide-react';
import { UserProfile } from '../interfaces/user.interface';
import { userProfileSchema } from '../interfaces/user.validation-schema';

const UserProfileScreen: React.FC = () => {
  // Mock initial user data - in a real app, you'd fetch this from your backend
  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phoneNumber: '(555) 123-4567',
    gender: 'male',
    profilePhoto: '/api/placeholder/150/150', // Using a placeholder image
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (
    values: UserProfile,
    { setSubmitting }: FormikHelpers<UserProfile>
  ) => {
    // In a real app, you'd send this data to your backend
    setTimeout(() => {
      setUser(values);
      setIsEditing(false);
      setSubmitting(false);
      toast('Profile updated');
    }, 500);
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <PenLine size={16} />
                Edit Profile
              </Button>
            )}
          </div>
          <CardDescription>Manage your personal information</CardDescription>
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <Formik
              initialValues={user}
              validationSchema={userProfileSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                isSubmitting,
                setFieldValue,
                handleChange,
              }) => (
                <Form className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Photo Section */}
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-32 w-32">
                        <AvatarImage
                          src={values.profilePhoto}
                          alt={values.name}
                        />
                        <AvatarFallback>
                          <User size={64} />
                        </AvatarFallback>
                      </Avatar>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => {
                          // In a real app, you'd open a file picker here
                          // For now, we'll just simulate changing the photo
                          setFieldValue(
                            'profilePhoto',
                            '/api/placeholder/150/150?random=' + Math.random()
                          );
                        }}
                      >
                        <Camera size={16} />
                        Change Photo
                      </Button>
                    </div>

                    {/* Profile Details Section */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Field name="name">
                            {({ field }: any) => (
                              <Input
                                id="name"
                                {...field}
                                className={
                                  errors.name && touched.name
                                    ? 'border-red-500'
                                    : ''
                                }
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Field name="email">
                            {({ field }: any) => (
                              <Input
                                id="email"
                                type="email"
                                {...field}
                                className={
                                  errors.email && touched.email
                                    ? 'border-red-500'
                                    : ''
                                }
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phoneNumber">Phone Number</Label>
                          <Field name="phoneNumber">
                            {({ field }: any) => (
                              <Input
                                id="phoneNumber"
                                {...field}
                                className={
                                  errors.phoneNumber && touched.phoneNumber
                                    ? 'border-red-500'
                                    : ''
                                }
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="phoneNumber"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="gender">Gender</Label>
                          <Select
                            value={values.gender}
                            onValueChange={(value) =>
                              setFieldValue('gender', value)
                            }
                          >
                            <SelectTrigger
                              id="gender"
                              className={
                                errors.gender && touched.gender
                                  ? 'border-red-500'
                                  : ''
                              }
                            >
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardFooter className="flex justify-end gap-2 border-t pt-6 px-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2"
                    >
                      <Check size={16} />
                      Save Changes
                    </Button>
                  </CardFooter>
                </Form>
              )}
            </Formik>
          ) : (
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={user.profilePhoto} alt={user.name} />
                  <AvatarFallback>
                    <User size={64} />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Details Section */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <p className="text-lg">{user.name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <p className="text-lg">{user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <p className="text-lg">{user.phoneNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <p className="text-lg capitalize">{user.gender}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileScreen;
