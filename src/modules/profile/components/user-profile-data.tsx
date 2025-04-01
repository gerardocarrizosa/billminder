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

function UserProfileData() {
  const navigate = useNavigate();
  const { user: fb_user } = useAuth();
  if (!fb_user) return null;

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

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('edit')}
            className="flex items-center gap-2"
          >
            <PenLine size={16} />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}

export default UserProfileData;
