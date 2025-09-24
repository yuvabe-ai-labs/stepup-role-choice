import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Construction } from 'lucide-react';

const Units = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <Construction className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Units Coming Soon</h1>
          <p className="text-muted-foreground max-w-md">
            We're working hard to bring you amazing learning units. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Units;