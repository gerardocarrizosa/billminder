import { useNavigate } from 'react-router-dom';
import { Button } from '@/modules/common/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/modules/common/components/ui/card';
import { HardHat, MoveRight } from 'lucide-react';

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <HardHat size={48} className="text-amber-500" />
          </div>
          <CardTitle className="text-2xl">En construcción</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Estamos trabajando para mejorar esta página. Mientras tanto, puedes
            administrar tus facturas haciendo clic en el botón de abajo.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => navigate('/bills')}
            className="flex items-center gap-2"
          >
            Ir a Facturas
            <MoveRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default HomeScreen;
