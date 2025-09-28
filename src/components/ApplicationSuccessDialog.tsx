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
      <DialogContent className="max-w-md text-center p-8">
        <div className="space-y-6">
          {/* Success Illustration */}
          <div className="flex justify-center">
            <img 
              src={successIllustration} 
              alt="Success" 
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Profile Sent Successfully!
            </h2>
            <p className="text-sm text-gray-600">
              Your profile has been sent to the Unit successfully!
            </p>
          </div>

          {/* Close Button */}
          <Button 
            onClick={onClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationSuccessDialog;