// import { useAuth } from '@/hooks/useAuth';
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '@/integrations/supabase/client';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { ChevronRight, HelpCircle } from 'lucide-react';

// interface Profile {
//   id: string;
//   full_name: string;
//   role: string;
//   created_at: string;
// }

// const ProfileSidebar = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [profile, setProfile] = useState<Profile | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!user) return;

//       try {
//         const { data, error } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('user_id', user.id)
//           .maybeSingle();

//         if (!error && data) {
//           setProfile(data);
//         }
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       }
//     };

//     fetchProfile();
//   }, [user]);

//   return (
//     <div className="space-y-6">
//       {/* Profile Card */}
//       <Card className="p-6 text-center">
//         <div className="flex flex-col items-center space-y-4">
//           <Avatar className="h-20 w-20 ring-4 ring-primary/20">
//             <AvatarImage src="" />
//             <AvatarFallback className="text-lg bg-primary text-primary-foreground">
//               {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
//             </AvatarFallback>
//           </Avatar>
          
//           <div>
//             <h3 className="font-semibold text-lg">{profile?.full_name || 'User'}</h3>
//             <p className="text-sm text-muted-foreground capitalize">
//               {profile?.role || 'Student'}
//             </p>
//           </div>

//           <Button 
//             variant="outline" 
//             size="sm" 
//             className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
//             onClick={() => navigate('/profile')}
//           >
//             View Profile
//           </Button>
//         </div>
//       </Card>

//       {/* Profile Performance */}
//       <Card className="p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h4 className="font-medium">Profile Performance</h4>
//           <HelpCircle className="w-4 h-4 text-muted-foreground" />
//         </div>
        
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <div>
//             <p className="text-sm text-muted-foreground">Applied</p>
//             <div className="flex items-center space-x-1">
//               <span className="text-2xl font-bold">15</span>
//               <ChevronRight className="w-4 h-4 text-muted-foreground" />
//             </div>
//           </div>
          
//           <div>
//             <p className="text-sm text-muted-foreground">Saved</p>
//             <div className="flex items-center space-x-1">
//               <span className="text-2xl font-bold">4</span>
//               <ChevronRight className="w-4 h-4 text-muted-foreground" />
//             </div>
//           </div>
//         </div>

//         {/* AI Resume Builder Prompt */}
//         <Card className="bg-primary text-primary-foreground p-4">
//           <div className="flex items-center space-x-3">
//             <div className="flex-shrink-0">
//               <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
//                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
//                   <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-.64-1.8c-.4-.5-.92-.7-1.52-.7-.6 0-1.1.1-1.53.35-.4.25-.72.58-.91.99-.19.4-.29.86-.29 1.36v5.1H9.5V9h4.06v1.3c.45-.54.99-.95 1.6-1.25.6-.3 1.27-.45 1.99-.45.59 0 1.13.1 1.61.28.48.19.89.45 1.23.78.34.34.6.73.78 1.17.18.44.28.91.28 1.41v7.26H18.5z"/>
//                 </svg>
//               </div>
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-sm font-medium">Get noticed by top Units with a resume built by AI Resume Builder</p>
//             </div>
//             <ChevronRight className="w-4 h-4 flex-shrink-0" />
//           </div>
//         </Card>
//       </Card>
//     </div>
//   );
// };

// export default ProfileSidebar;


import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, HelpCircle } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
}

const ProfileSidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!error && data) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <div className="w-full max-w-sm">
      {/* Profile Card */}
      <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-xl">
        {/* Profile Info Section */}
        <div className="text-center mb-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-4 ring-green-400">
                <AvatarImage src="" />
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {profile?.full_name?.charAt(0) ||
                    user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Green status indicator */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {profile?.full_name}
              </h3>
              <p className="text-sm text-gray-500">{profile?.role}</p>
            </div>

            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </Button>
          </div>
        </div>

        {/* Profile Performance Section */}
        <Card className="p-6 bg-white shadow-sm border border-gray-200 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Profile Performance</h4>
            <HelpCircle className="w-4 h-4 text-gray-400" />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 divide-x divide-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Applied</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">15</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="pl-6">
              <p className="text-sm text-gray-500 mb-1">Saved</p>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">4</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* AI Resume Builder Prompt */}
          <Card className="bg-teal-600 text-white p-4 rounded-xl border-0">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-5">
                  Get noticed by top Units with a resume built by AI Resume
                  Builder
                </p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </div>
          </Card>
        </Card>
      </Card>
    </div>
  );
};

export default ProfileSidebar;
