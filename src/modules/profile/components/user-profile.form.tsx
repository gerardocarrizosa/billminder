import { Form, Formik } from 'formik';
import { User } from '../interfaces/user.interface';
import { userValidationSchema } from '../interfaces/user.validation-schema';
import userService from '@/lib/api/users.api';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/modules/common/components/ui/avatar';
import { Camera, Check, UserIcon, X } from 'lucide-react';
import { Button } from '@/modules/common/components/ui/button';
import FormInput from '@/modules/common/components/form-input';
import FormSelect from '@/modules/common/components/form-select';
import FormDatePicker from '@/modules/common/components/form-date-picker';
import { CardFooter } from '@/modules/common/components/ui/card';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfileForm = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  if (!user) return null;

  const handleSubmit = async (values: User) => {
    await userService.updateUser(user.id, values);
    toast.success('Perfil actualizado');
    refreshProfile();
    navigate('/profile');
  };

  const isFormUpdated = (values: User): boolean => {
    if (values.dateOfBirth !== user.dateOfBirth) return true;
    if (values.email !== user.email) return true;
    if (values.gender !== user.gender) return true;
    if (values.id !== user.id) return true;
    if (values.name !== user.name) return true;
    if (values.phoneNumber !== user.phoneNumber) return true;
    if (values.profilePhoto !== user.profilePhoto) return true;
    if (values.uid !== user.uid) return true;
    return false;
  };

  return (
    <Formik
      initialValues={{
        id: user.id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        profilePhoto: user.profilePhoto,
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
                <AvatarImage src={values.profilePhoto} alt={values.name} />
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
                Cambiar foto
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
                    { label: 'Masculino', value: 'male' },
                    { label: 'Femenino', value: 'female' },
                    { label: 'Otro', value: 'other' },
                  ]}
                  placeholder="Selecciona un género"
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
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isFormUpdated(values)}
              className="flex items-center gap-2"
            >
              <Check size={16} />
              Guardar cambios
            </Button>
          </CardFooter>
        </Form>
      )}
    </Formik>
  );
};

export default UserProfileForm;
