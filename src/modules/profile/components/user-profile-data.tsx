import { useAuth } from '@/context/AuthContext';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/modules/common/components/ui/avatar';
import { Button } from '@/modules/common/components/ui/button';
import { Label } from '@/modules/common/components/ui/label';
import { PenLine, UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserGender } from '../interfaces/user.interface';

function UserProfileData() {
  const navigate = useNavigate();
  const { user: fb_user } = useAuth();
  if (!fb_user) return null;

  const getGenderString = (gender: UserGender) => {
    switch (gender) {
      case 'female':
        return 'Femenino';
      case 'male':
        return 'Masculino';
      case 'other':
        return 'Otro';
      default:
        return 'No configurado';
    }
  };

  return (
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
            <Label htmlFor="name">Nombre</Label>
            <p>{fb_user.name}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <p>{fb_user.email}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Celular</Label>
            <p>{fb_user.phoneNumber}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Género</Label>
            <p>{getGenderString(fb_user.gender!)}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Fecha de nacimiento</Label>
            <p>{fb_user.dateOfBirth}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('edit')}
            className="flex items-center gap-2"
          >
            <PenLine size={16} />
            Editar perfil
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserProfileData;
