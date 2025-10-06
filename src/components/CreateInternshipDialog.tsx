import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { X, Upload, Sparkles } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

interface CreateInternshipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Language proficiency type
interface LanguageProficiency {
  language: string;
  read: boolean;
  write: boolean;
  speak: boolean;
}

// Validation schema
const languageSchema = z.object({
  language: z.string().min(1, 'Language is required'),
  read: z.boolean(),
  write: z.boolean(),
  speak: z.boolean(),
}).refine(
  (data) => data.read || data.write || data.speak,
  { message: 'Select at least one proficiency (Read, Write, or Speak)', path: ['read'] }
);

const formSchema = z.object({
  title: z.string().min(1, 'Job/Intern Role is required'),
  duration: z.string().min(1, 'Internship Period is required'),
  isPaid: z.boolean(),
  payment: z.string().optional(),
  description: z.string().min(10, 'About Internship must be at least 10 characters'),
  responsibilities: z.string().min(10, 'Key Responsibilities is required'),
  benefits: z.string().min(10, 'Post Internship benefits is required'),
  skills_required: z.string().min(1, 'Skills Required is required'),
  language_requirements: z.array(languageSchema).min(1, 'At least one language is required'),
  application_deadline: z.date({ required_error: 'Application deadline is required' }),
}).refine(
  (data) => {
    if (data.isPaid) {
      return data.payment && data.payment.length > 0;
    }
    return true;
  },
  { message: 'Payment amount is required for paid internships', path: ['payment'] }
);

type FormData = z.infer<typeof formSchema>;

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 
  'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Urdu', 'French', 
  'Spanish', 'German', 'Mandarin', 'Japanese', 'Korean'
];

const CreateInternshipDialog: React.FC<CreateInternshipDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [languages, setLanguages] = useState<LanguageProficiency[]>([
    { language: '', read: false, write: false, speak: false }
  ]);

  const { control, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      duration: '',
      isPaid: false,
      payment: '',
      description: '',
      responsibilities: '',
      benefits: '',
      skills_required: '',
      language_requirements: [{ language: '', read: false, write: false, speak: false }],
      application_deadline: undefined,
    },
  });

  const isPaid = watch('isPaid');

  const handleAddLanguage = () => {
    const newLanguages = [...languages, { language: '', read: false, write: false, speak: false }];
    setLanguages(newLanguages);
    setValue('language_requirements', newLanguages, { shouldValidate: true });
  };

  const handleLanguageChange = (index: number, field: keyof LanguageProficiency, value: any) => {
    const newLanguages = [...languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setLanguages(newLanguages);
    setValue('language_requirements', newLanguages, { shouldValidate: true });
  };

  const handleRemoveLanguage = (index: number) => {
    if (languages.length > 1) {
      const newLanguages = languages.filter((_, i) => i !== index);
      setLanguages(newLanguages);
      setValue('language_requirements', newLanguages, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an internship",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('Profile not found');
      }

      // Parse skills and responsibilities into arrays
      const skillsArray = data.skills_required.split(',').map(s => s.trim());
      const responsibilitiesArray = data.responsibilities.split('\n').filter(r => r.trim());
      const benefitsArray = data.benefits.split('\n').filter(b => b.trim());
const { data: units } = await supabase
  .from('units')
  .select('unit_name')
      .eq('profile_id', profile.id)
  .single();
      

company_name: profile.company_name,

      // Create internship
      console.log('Creating internship with profile ID:', profile.id);
      const { error } = await supabase.from('internships').insert({
        title: data.title,
        duration: data.duration,
        is_paid: data.isPaid,
        payment: data.isPaid ? data.payment : null,
        description: data.description,
        responsibilities: responsibilitiesArray,
        benefits: benefitsArray,
        skills_required: skillsArray,
        language_requirements: data.language_requirements,
        application_deadline: format(data.application_deadline, 'yyyy-MM-dd'),
        created_by: profile.id,
        status: 'active',
        company_name: units.unit_name,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Internship posted successfully!",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating internship:', error);
      toast({
        title: "Error",
        description: "Failed to create internship. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // AI Assistant function
  const handleAIAssist = async (fieldName: keyof FormData) => {
    console.log('AI Assist triggered for:', fieldName);
    setAiLoading(fieldName);

    try {
      const currentValue = watch(fieldName) as string;
      const jobTitle = watch('title') || 'this position';
      
      let prompt = '';
      
      switch (fieldName) {
        case 'description':
          prompt = `Write a clear and professional "About Internship" description for a ${jobTitle} internship position. The description should be 1-2 paragraphs explaining what the internship is about, what the intern will be doing. Make it engaging and suitable for all types of internship roles.${currentValue ? ` Current description: "${currentValue}". Please improve and rewrite it.` : ''}`;
          break;
        case 'responsibilities':
          prompt = `List 5-7 key responsibilities for a ${jobTitle} internship. Format as bullet points, one per line. Make them clear, actionable, and relevant to the role.${currentValue ? ` Current responsibilities: "${currentValue}". Please improve and expand on them.` : ''}`;
          break;
        case 'benefits':
          prompt = `List 4-6 post-internship benefits that a candidate would receive after completing a ${jobTitle} internship. Format as bullet points, one per line. Include things like certificates, recommendations, networking opportunities, skill development, etc.${currentValue ? ` Current benefits: "${currentValue}". Please improve and expand on them.` : ''}`;
          break;
        case 'skills_required':
          prompt = `List 5-8 essential skills required for a ${jobTitle} internship. Format as a comma-separated list. Include both technical and soft skills relevant to the role.${currentValue ? ` Current skills: "${currentValue}". Please improve and expand on them.` : ''}`;
          break;
        default:
          prompt = `Help improve the following text for a ${jobTitle} internship: ${currentValue}`;
      }

      const { data: aiResponse, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: prompt,
          conversationHistory: [],
          userRole: 'unit'
        }
      });
      console.log(prompt);
      console.log('AI Response:', aiResponse);


      if (error) throw error;

      if (aiResponse?.response) {
        // Clean up the response (remove markdown formatting if present)
        let cleanResponse = aiResponse.response
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/^#+\s/gm, '')
          .trim();

        setValue(fieldName, cleanResponse, { shouldValidate: true });

        toast({
          title: "AI Suggestion Applied",
          description: "The content has been generated successfully!",
        });
      }
    } catch (error) {
      console.error('AI Assist error:', error);
      toast({
        title: "AI Assist Failed",
        description: "Unable to generate AI suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold">Create new Job Description</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                This information is important for candidates to know better about Job/Internship
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-6">
            {/* File Upload Section */}
            <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 bg-primary/5">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <Upload className="w-12 h-12 text-primary" />
                <div>
                  <p className="font-semibold text-lg">Upload Job Description</p>
                  <p className="text-sm text-muted-foreground">File should be PDF, Word, Google Docs</p>
                </div>
                <p className="text-sm text-muted-foreground">Drag and Drop your files here</p>
              </div>
            </div>

            {/* Job/Intern Role */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Job/Intern Role <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="title"
                    placeholder="Enter Job role"
                    className="bg-background"
                  />
                )}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            {/* Internship Period */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Internship Period <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="duration"
                    placeholder="Example: 3 months / 1 month"
                    className="bg-background"
                  />
                )}
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration.message}</p>
              )}
            </div>

            {/* Internship Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Internship Type <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-6">
                <Controller
                  name="isPaid"
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant={field.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => field.onChange(true)}
                          className="rounded-full px-6"
                        >
                          Paid
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant={!field.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => field.onChange(false)}
                          className="rounded-full px-6"
                        >
                          Unpaid
                        </Button>
                      </div>
                    </>
                  )}
                />
                {isPaid && (
                  <Controller
                    name="payment"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter amount"
                        className="max-w-[200px]"
                      />
                    )}
                  />
                )}
              </div>
              {errors.payment && (
                <p className="text-sm text-destructive">{errors.payment.message}</p>
              )}
            </div>

            {/* About Internship */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                About Internship <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="Type here"
                      className="min-h-[120px] bg-background resize-none"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="absolute bottom-2 right-2 bg-teal-600 hover:bg-teal-700"
                      onClick={() => handleAIAssist('description')}
                      disabled={aiLoading === 'description'}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {aiLoading === 'description' ? 'Generating...' : 'AI Assistant'}
                    </Button>
                  </div>
                )}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            {/* Key Responsibilities */}
            <div className="space-y-2">
              <Label htmlFor="responsibilities" className="text-sm font-medium">
                Key Responsibilities <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="responsibilities"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Textarea
                      {...field}
                      id="responsibilities"
                      placeholder="Type here"
                      className="min-h-[120px] bg-background resize-none"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="absolute bottom-2 right-2 bg-teal-600 hover:bg-teal-700"
                      onClick={() => handleAIAssist('responsibilities')}
                      disabled={aiLoading === 'responsibilities'}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {aiLoading === 'responsibilities' ? 'Generating...' : 'AI Assistant'}
                    </Button>
                  </div>
                )}
              />
              {errors.responsibilities && (
                <p className="text-sm text-destructive">{errors.responsibilities.message}</p>
              )}
            </div>

            {/* Post Internship Benefits */}
            <div className="space-y-2">
              <Label htmlFor="benefits" className="text-sm font-medium">
                What you will get (Post Internship) <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="benefits"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Textarea
                      {...field}
                      id="benefits"
                      placeholder="Type here"
                      className="min-h-[120px] bg-background resize-none"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="absolute bottom-2 right-2 bg-teal-600 hover:bg-teal-700"
                      onClick={() => handleAIAssist('benefits')}
                      disabled={aiLoading === 'benefits'}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {aiLoading === 'benefits' ? 'Generating...' : 'AI Assistant'}
                    </Button>
                  </div>
                )}
              />
              {errors.benefits && (
                <p className="text-sm text-destructive">{errors.benefits.message}</p>
              )}
            </div>

            {/* Skills Required */}
            <div className="space-y-2">
              <Label htmlFor="skills_required" className="text-sm font-medium">
                Skills Required <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="skills_required"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <Textarea
                      {...field}
                      id="skills_required"
                      placeholder="Type here"
                      className="min-h-[120px] bg-background resize-none"
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="absolute bottom-2 right-2 bg-teal-600 hover:bg-teal-700"
                      onClick={() => handleAIAssist('skills_required')}
                      disabled={aiLoading === 'skills_required'}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      {aiLoading === 'skills_required' ? 'Generating...' : 'AI Assistant'}
                    </Button>
                  </div>
                )}
              />
              {errors.skills_required && (
                <p className="text-sm text-destructive">{errors.skills_required.message}</p>
              )}
            </div>

            {/* Language Proficiency */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">
                Language Proficiency <span className="text-destructive">*</span>
              </Label>
              {languages.map((lang, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <Select
                      value={lang.language}
                      onValueChange={(value) => handleLanguageChange(index, 'language', value)}
                    >
                      <SelectTrigger className="flex-1 bg-background">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {languages.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLanguage(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  {lang.language && (
                    <div className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`read-${index}`}
                          checked={lang.read}
                          onCheckedChange={(checked) => 
                            handleLanguageChange(index, 'read', checked === true)
                          }
                        />
                        <label
                          htmlFor={`read-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Read
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`write-${index}`}
                          checked={lang.write}
                          onCheckedChange={(checked) => 
                            handleLanguageChange(index, 'write', checked === true)
                          }
                        />
                        <label
                          htmlFor={`write-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Write
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`speak-${index}`}
                          checked={lang.speak}
                          onCheckedChange={(checked) => 
                            handleLanguageChange(index, 'speak', checked === true)
                          }
                        />
                        <label
                          htmlFor={`speak-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Speak
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="link"
                onClick={handleAddLanguage}
                className="text-primary pl-0"
              >
                Add another language
              </Button>
              {errors.language_requirements && (
                <p className="text-sm text-destructive">{errors.language_requirements.message}</p>
              )}
            </div>

            {/* Last date to apply */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Last date to apply <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="application_deadline"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-background",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.application_deadline && (
                <p className="text-sm text-destructive">{errors.application_deadline.message}</p>
              )}
            </div>
          </form>
        </ScrollArea>

        <div className="px-6 py-4 border-t">
          <Button 
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || !isValid}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInternshipDialog;
