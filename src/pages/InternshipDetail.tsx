import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Internship = Tables<'internships'>;

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching internship:', error);
      } else {
        setInternship(data);
      }
      setLoading(false);
    };

    fetchInternship();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto p-6">
          <p>Internship not found</p>
          <Button onClick={() => navigate('/internships')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Internships
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6">
        <Button onClick={() => navigate('/internships')} variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Internships
        </Button>
        
        <div className="bg-card p-8 rounded-3xl">
          <h1 className="text-3xl font-bold mb-4">{internship.title}</h1>
          <p className="text-muted-foreground mb-2">{internship.company_name}</p>
          <p className="text-muted-foreground mb-6">{internship.location}</p>
          
          {/* Add your detailed view content here */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p>{internship.description}</p>
            </div>
            
            {/* More sections will be added later */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetail;
