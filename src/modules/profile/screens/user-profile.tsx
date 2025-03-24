import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
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
import { PenLine, Camera, User as UserIcon, Check, X } from 'lucide-react';
import { userValidationSchema } from '../interfaces/user.validation-schema';
import { useAuth } from '@/context/AuthContext';
import { User } from '../interfaces/user.interface';
import userService from '@/lib/api/users.api';
import FormInput from '@/modules/common/components/form-input';
import FormSelect from '@/modules/common/components/form-select';
import FormDatePicker from '@/modules/common/components/form-date-picker';

const UserProfileScreen: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user: fb_user } = useAuth();

  if (!fb_user) return null;

  const handleSubmit = async (values: User) => {
    await userService.updateUser(fb_user.id, values);
    setIsEditing(false);
    toast('Profile updated');
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
              initialValues={{
                id: fb_user.id,
                uid: fb_user.uid,
                email: fb_user.email,
                name: fb_user.name,
                phoneNumber: fb_user.phoneNumber,
                dateOfBirth: fb_user.dateOfBirth,
                gender: fb_user.gender,
                profilePhoto: fb_user.profilePhoto,
              }}
              validationSchema={userValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, isSubmitting, setFieldValue }) => (
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
                          <UserIcon size={64} />
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
                        <FormInput label="Nombre" name="name" />
                        <FormInput label="Correo electrónico" name="email" />
                        <FormInput label="Telefono" name="phoneNumber" />
                        <FormSelect
                          name="gender"
                          label="Género"
                          options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                            { label: 'Other', value: 'other' },
                          ]}
                          placeholder="Select gender"
                        />
                        <FormDatePicker
                          name="dateOfBirth"
                          label="Fecha de nacimiento"
                        />
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
                  <AvatarImage src={fb_user.profilePhoto} alt={fb_user.name} />
                  <AvatarFallback>
                    <UserIcon size={64} />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Details Section */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <p className="text-lg">{fb_user.name}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <p className="text-lg">{fb_user.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <p className="text-lg">{fb_user.phoneNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <p className="text-lg capitalize">{fb_user.gender}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Fecha de nacimiento</Label>
                    <p className="text-lg capitalize">{fb_user.dateOfBirth}</p>
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
