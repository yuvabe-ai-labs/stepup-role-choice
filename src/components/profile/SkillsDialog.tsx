import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { StudentProfile } from "@/types/profile";

interface SkillsDialogProps {
  studentProfile: StudentProfile | null;
  onUpdate: (updates: Partial<StudentProfile>) => Promise<void>;
  children: React.ReactNode;
}

export const SkillsDialog = ({ studentProfile, onUpdate, children }: SkillsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>(studentProfile?.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate({ skills });
      setOpen(false);
    } catch (error) {
      console.error("Error updating skills:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Add a skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              className="rounded-full"
            />

            <Button type="button" onClick={addSkill} size="sm" className="rounded-full">
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {skill}

                <X className="w-3 h-3 cursor-pointer" onClick={() => removeSkill(skill)} />
              </Badge>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="rounded-full">
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// import { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { X, Plus } from 'lucide-react';
// import { StudentProfile } from '@/types/profile';

// interface SkillsDialogProps {
//   studentProfile: StudentProfile | null;
//   onUpdate: (updates: Partial<StudentProfile>) => Promise<void>;
//   children: React.ReactNode;
// }

// export const SkillsDialog = ({ studentProfile, onUpdate, children }: SkillsDialogProps) => {
//   const [open, setOpen] = useState(false);
//   const [skills, setSkills] = useState<string[]>(studentProfile?.skills || []);
//   const [newSkill, setNewSkill] = useState('');
//   const [loading, setLoading] = useState(false);

//   const addSkill = () => {
//     if (newSkill.trim() && !skills.includes(newSkill.trim())) {
//       setSkills([...skills, newSkill.trim()]);
//       setNewSkill('');
//     }
//   };

//   const removeSkill = (skillToRemove: string) => {
//     setSkills(skills.filter(skill => skill !== skillToRemove));
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       await onUpdate({ skills });
//       setOpen(false);
//     } catch (error) {
//       console.error('Error updating skills:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       e.preventDefault();
//       addSkill();
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         {children}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Edit Skills</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div className="flex space-x-2">
//             <Input
//               placeholder="Add a skill"
//               value={newSkill}
//               onChange={(e) => setNewSkill(e.target.value)}
//               onKeyPress={handleKeyPress}
//             />
//             <Button type="button" onClick={addSkill} size="sm">
//               <Plus className="h-4 w-4" />
//             </Button>
//           </div>

//           <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
//             {skills.map((skill, index) => (
//               <Badge key={index} variant="secondary" className="px-3 py-1">
//                 {skill}
//                 <button
//                   onClick={() => removeSkill(skill)}
//                   className="ml-2 hover:bg-red-500 hover:text-white rounded-full p-0.5"
//                 >
//                   <X className="h-3 w-3" />
//                 </button>
//               </Badge>
//             ))}
//           </div>

//           <div className="flex justify-end space-x-2">
//             <Button type="button" variant="outline" onClick={() => setOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSave} disabled={loading}>
//               {loading ? 'Saving...' : 'Save Changes'}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
