import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowRight } from "lucide-react";
import { validateSignUp } from "../utils/validation";
import RegistrationStepPersonal from './RegistrationStepPersonal';
import RegistrationStepContact from './RegistrationStepContact';
import RegistrationStepSecurity from './RegistrationStepSecurity';

type Step = 'personal' | 'contact' | 'security';

const RegisterForm = () => {
  const [step, setStep] = useState<Step>('personal');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 'personal') setStep('contact');
    else if (step === 'contact') setStep('security');
  };

  const handleBack = () => {
    if (step === 'security') setStep('contact');
    else if (step === 'contact') setStep('personal');
  };

  // Utility function to clean up auth state
  const cleanupAuthState = () => {
    localStorage.removeItem('supabase.auth.token');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    const errors = validateSignUp(
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      password,
      confirmPassword
    );
    
    if (!agreedToTerms) {
      errors.agreedToTerms = "You must agree to the Terms and Conditions.";
    }
    if (!agreedToPrivacy) {
      errors.agreedToPrivacy = "You must agree to the Privacy Policy.";
    }
    
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Clean up any existing auth state
      cleanupAuthState();
      
      // First attempt to sign out globally in case there's an existing session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        // Ignore errors during cleanup
      }
      
      const formattedPhoneNumber = phoneNumber ? `${countryCode}${phoneNumber}` : '';
      
      console.log("Attempting to sign up with:", { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            country: country,
            phone_number: formattedPhoneNumber
          }
        }
      });
      
      if (error) throw error;
      
      console.log("Signup successful:", data);

      if (data.user) {
        const { error: leadError } = await supabase.from('leads').insert({
          user_id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          contact_number: formattedPhoneNumber,
          email: email,
        });

        if (leadError) {
          // If lead creation fails, we should probably handle this.
          // For now, we'll just log it.
          console.error("Error creating lead:", leadError);
        }
      }
      
      toast({
        title: "Account created successfully",
        description: "Welcome to Trade Pro! You are now logged in."
      });
      
      // The user is already logged in after signup, so just navigate to the dashboard
      navigate("/");
      
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "An error occurred during sign up";
      
      if (error.message) {
        if (error.message.includes("email")) {
          errorMessage = "This email is already in use";
        } else {
          errorMessage = error.message;
        }
      }
      
      setFormError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {formError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSignUp} className="space-y-4">
        {step === 'personal' && (
          <RegistrationStepPersonal
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            country={country}
            setCountry={setCountry}
            fieldErrors={fieldErrors}
          />
        )}
        {step === 'contact' && (
          <RegistrationStepContact
            email={email}
            setEmail={setEmail}
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            fieldErrors={fieldErrors}
          />
        )}
        {step === 'security' && (
          <RegistrationStepSecurity
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            agreedToTerms={agreedToTerms}
            setAgreedToTerms={setAgreedToTerms}
            agreedToPrivacy={agreedToPrivacy}
            setAgreedToPrivacy={setAgreedToPrivacy}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            fieldErrors={fieldErrors}
          />
        )}

        <div className="flex justify-between">
          {step !== 'personal' && (
            <Button type="button" variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step !== 'security' ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : (
                <span className="flex items-center">
                  Sign Up
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default RegisterForm;
