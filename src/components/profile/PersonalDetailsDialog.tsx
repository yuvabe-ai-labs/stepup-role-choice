import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DatabaseProfile, StudentProfile } from "@/types/profile";

const personalDetailsSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  headline: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  location: z.string().optional(),
  gender: z.string().optional(),
  marital_status: z.string().optional(),
  birth_date: z.string().optional(),
  birth_month: z.string().optional(),
  birth_year: z.string().optional(),
  is_differently_abled: z.boolean().optional(),
  has_career_break: z.boolean().optional(),
  languages: z.array(z.object({
    id: z.string(),
    name: z.string(),
    read: z.boolean(),
    write: z.boolean(),
    speak: z.boolean(),
  })).optional(),
});

type PersonalDetailsForm = z.infer<typeof personalDetailsSchema>;

interface PersonalDetailsDialogProps {
  profile: DatabaseProfile;
  studentProfile: StudentProfile | null;
  onUpdate: (updates: Partial<DatabaseProfile>) => Promise<void>;
  onUpdateStudent: (updates: Partial<StudentProfile>) => Promise<void>;
  children: React.ReactNode;
}

const LOCATIONS = ["Auroville", "Pondicherry", "Tamil Nadu", "Other"];
const MARITAL_STATUS_OPTIONS = ["Single", "Married", "Divorced", "Widowed", "Prefer not to say"];

export const PersonalDetailsDialog = ({ profile, studentProfile, onUpdate, onUpdateStudent, children }: PersonalDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [languages, setLanguages] = useState<Array<{
    id: string;
    name: string;
    read: boolean;
    write: boolean;
    speak: boolean;
  }>>([]);

  // Split full_name into first and last name
  const nameParts = profile.full_name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Parse date of birth
  const dateOfBirth = profile.date_of_birth ? new Date(profile.date_of_birth) : null;
  const birthDate = dateOfBirth ? String(dateOfBirth.getDate()) : "";
  const birthMonth = dateOfBirth ? String(dateOfBirth.getMonth() + 1) : "";
  const birthYear = dateOfBirth ? String(dateOfBirth.getFullYear()) : "";

  // Parse languages from studentProfile
  const parseLanguages = (langs: any) => {
    if (!langs) return [];
    if (typeof langs === "string") {
      try {
        return JSON.parse(langs);
      } catch {
        return [];
      }
    }
    return Array.isArray(langs) ? langs : [];
  };

  useEffect(() => {
    const parsedLanguages = parseLanguages(studentProfile?.languages);
    setLanguages(parsedLanguages.length > 0 ? parsedLanguages : []);
  }, [studentProfile?.languages]);

  const form = useForm<PersonalDetailsForm>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      headline: studentProfile?.headline || "",
      email: profile.email || "",
      phone: profile.phone || "",
      location: studentProfile?.location || "",
      gender: profile.gender || "",
      marital_status: studentProfile?.marital_status || "",
      birth_date: birthDate,
      birth_month: birthMonth,
      birth_year: birthYear,
      is_differently_abled: studentProfile?.is_differently_abled || false,
      has_career_break: studentProfile?.has_career_break || false,
      languages: languages,
    },
  });

  const addLanguage = () => {
    setLanguages([...languages, {
      id: crypto.randomUUID(),
      name: "",
      read: false,
      write: false,
      speak: false,
    }]);
  };

  const removeLanguage = (id: string) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const updateLanguage = (id: string, field: string, value: any) => {
    setLanguages(languages.map(lang =>
      lang.id === id ? { ...lang, [field]: value } : lang
    ));
  };

  const onSubmit = async (data: PersonalDetailsForm) => {
    setLoading(true);
    try {
      // Combine first and last name
      const fullName = `${data.first_name} ${data.last_name}`.trim();

      // Construct date of birth from separate fields
      let dateOfBirth: string | null = null;
      if (data.birth_date && data.birth_month && data.birth_year) {
        const date = new Date(
          parseInt(data.birth_year),
          parseInt(data.birth_month) - 1,
          parseInt(data.birth_date)
        );
        dateOfBirth = date.toISOString().split("T")[0];
      }

      // Update profile table
      await onUpdate({
        full_name: fullName,
        email: data.email || null,
        phone: data.phone || null,
        gender: data.gender || null,
        date_of_birth: dateOfBirth,
      });

      // Update student_profiles table
      await onUpdateStudent({
        headline: data.headline || null,
        location: data.location || null,
        marital_status: data.marital_status || null,
        is_differently_abled: data.is_differently_abled || false,
        has_career_break: data.has_career_break || false,
        languages: languages.length > 0 ? languages : null,
      });

      setOpen(false);
    } catch (error) {
      console.error("Error updating personal details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Personal Details</DialogTitle>
          <p className="text-sm text-muted-foreground">This information is important for employers to know you better</p>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" placeholder="Enter Name" {...form.register("first_name")} />
                {form.formState.errors.first_name && (
                  <p className="text-sm text-red-500">{form.formState.errors.first_name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" placeholder="Enter Name" {...form.register("last_name")} />
                {form.formState.errors.last_name && (
                  <p className="text-sm text-red-500">{form.formState.errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Headline */}
            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input 
                id="headline" 
                placeholder="Example: Digital Marketing Expert | Entrepreneur | Teacher" 
                {...form.register("headline")} 
              />
            </div>

            {/* Email & Contact Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="email@gmail.com" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Contact details</Label>
                <Input id="phone" placeholder="Example: +91 98765 43210" {...form.register("phone")} />
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">Location</Label>
              <Select value={form.watch("location")} onValueChange={(value) => form.setValue("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase()}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div>
              <Label>Gender</Label>
              <Controller
                name="gender"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-3 mt-2">
                    <div className="flex items-center">
                      <RadioGroupItem value="male" id="male" className="peer sr-only" />
                      <Label
                        htmlFor="male"
                        className="px-6 py-2 rounded-full border cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                      >
                        Male
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="female" id="female" className="peer sr-only" />
                      <Label
                        htmlFor="female"
                        className="px-6 py-2 rounded-full border cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                      >
                        Female
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <RadioGroupItem value="other" id="other" className="peer sr-only" />
                      <Label
                        htmlFor="other"
                        className="px-6 py-2 rounded-full border cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                      >
                        Other
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* More Information Section */}
            <div className="pt-4">
              <h3 className="font-semibold mb-2">More Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Companies are focusing on equal opportunities and might be looking for candidates from diverse backgrounds
              </p>
            </div>

            {/* Marital Status */}
            <div>
              <Label>Marital status</Label>
              <Controller
                name="marital_status"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} className="flex flex-wrap gap-3 mt-2">
                    {MARITAL_STATUS_OPTIONS.map((status) => (
                      <div key={status} className="flex items-center">
                        <RadioGroupItem value={status.toLowerCase()} id={status} className="peer sr-only" />
                        <Label
                          htmlFor={status}
                          className="px-4 py-2 rounded-full border cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground text-sm"
                        >
                          {status}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <Label>Date Of Birth</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <Select value={form.watch("birth_date")} onValueChange={(value) => form.setValue("birth_date", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Date" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={String(day)}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.watch("birth_month")} onValueChange={(value) => form.setValue("birth_month", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, idx) => (
                      <SelectItem key={month} value={String(idx + 1)}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={form.watch("birth_year")} onValueChange={(value) => form.setValue("birth_year", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Differently Abled */}
            <div>
              <Label>Are you differently abled?</Label>
              <Controller
                name="is_differently_abled"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup value={field.value ? "true" : "false"} onValueChange={(value) => field.onChange(value === "true")} className="flex gap-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="differently-abled-yes" />
                      <Label htmlFor="differently-abled-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="differently-abled-no" />
                      <Label htmlFor="differently-abled-no">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* Career Break */}
            <div>
              <Label>Have you taken any career break?</Label>
              <Controller
                name="has_career_break"
                control={form.control}
                render={({ field }) => (
                  <RadioGroup value={field.value ? "true" : "false"} onValueChange={(value) => field.onChange(value === "true")} className="flex gap-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="career-break-yes" />
                      <Label htmlFor="career-break-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="career-break-no" />
                      <Label htmlFor="career-break-no">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {/* Language Proficiency */}
            <div>
              <Label className="mb-3 block">Language Proficiency</Label>
              {languages.map((language, index) => (
                <div key={language.id} className="space-y-3 mb-4 p-4 border rounded-lg relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeLanguage(language.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Select
                    value={language.name}
                    onValueChange={(value) => updateLanguage(language.id, "name", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`read-${language.id}`}
                        checked={language.read}
                        onCheckedChange={(checked) => updateLanguage(language.id, "read", checked)}
                      />
                      <Label htmlFor={`read-${language.id}`}>Read</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`write-${language.id}`}
                        checked={language.write}
                        onCheckedChange={(checked) => updateLanguage(language.id, "write", checked)}
                      />
                      <Label htmlFor={`write-${language.id}`}>Write</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`speak-${language.id}`}
                        checked={language.speak}
                        onCheckedChange={(checked) => updateLanguage(language.id, "speak", checked)}
                      />
                      <Label htmlFor={`speak-${language.id}`}>Speak</Label>
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="link" className="text-primary p-0" onClick={addLanguage}>
                Add another language
              </Button>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
