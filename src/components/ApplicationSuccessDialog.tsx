import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import successIllustration from '@/assets/success-illustration.png';

interface ApplicationSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApplicationSuccessDialog: React.FC<ApplicationSuccessDialogProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl text-center p-12 bg-white">
        <div className="space-y-8">
          {/* Success Message */}
          <h2 className="text-3xl font-bold text-gray-900">
            Your profile has been sent to the Unit Successfully!
          </h2>

          {/* Success Illustration */}
          <div className="flex justify-center py-8">
            <img 
              src={successIllustration} 
              alt="Success" 
              className="w-80 h-80 object-contain"
            />
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <Button 
              onClick={onClose}
              className="px-12 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationSuccessDialog;